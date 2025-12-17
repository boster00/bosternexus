import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { createClient } from "@supabase/supabase-js";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing required Stripe environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let eventType;
  let event;

  // Create a private supabase client using the secret service_role API key for auth admin operations
  // Disable realtime to reduce Edge Runtime warnings
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
      realtime: { disabled: true }
    }
  );

  // Use DAL with service role for database operations
  const dal = new DataAccessLayer({
    useServiceRole: true,
    requireUserId: false, // Webhook operations are system-level
    autoTimestamps: true,
  });

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject = event.data.object;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        const customer = await stripe.customers.retrieve(customerId);

        if (!plan) break;

        let user;
        if (!userId) {
          // check if user already exists using DAL
          const profile = await dal.getSingle("profiles", { email: customer.email });
          if (profile) {
            user = profile;
          } else {
            // create a new user using supabase auth admin (auth operations still use direct client)
            const { data, error: authError } = await supabase.auth.admin.createUser({
              email: customer.email,
            });

            if (authError) {
              console.error("Failed to create auth user:", authError);
              throw authError;
            }

            user = data?.user;            
            if (user?.id) {
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const existingProfile = await dal.getSingle("profiles", { id: user.id });
              
              if (existingProfile) {
                user = existingProfile;
              }
            }
          }
        } else {
          // find user by ID using DAL
          const profile = await dal.getSingle("profiles", { id: userId });
          user = profile;
        }

        if (!user?.id) {
          console.error("User ID is null, cannot create/update profile");
          throw new Error("User ID is required for profile creation");
        }

        // Upsert profile using DAL
        const { error } = await dal.upsert("profiles", {
          id: user.id,
          email: customer.email,
          customer_id: customerId,
          price_id: priceId,
          has_access: true,
          user_id: user.id, // Explicitly set user_id
        }, { onConflict: 'id' });

        if (error) {
          console.error("Failed to upsert profile:", error);
          throw error;
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        // Update profile using DAL
        await dal.update("profiles", { has_access: false }, { customer_id: subscription.customer });
        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const stripeObject = event.data.object;
        const priceId = stripeObject.lines.data[0].price.id;
        const customerId = stripeObject.customer;

        // Find profile where customer_id equals the customerId using DAL
        const profile = await dal.getSingle("profiles", { customer_id: customerId });

        // Make sure the invoice is for the same plan (priceId) the user subscribed to
        if (!profile || profile.price_id !== priceId) break;

        // Grant the profile access to your product using DAL
        await dal.update("profiles", { has_access: true }, { customer_id: customerId });

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
