import { NextResponse } from "next/server";
import { DataAccessLayer } from "@/libs/supabase/data-access-layer";

export const dynamic = "force-dynamic";

// API endpoint to handle profile creation after email/password registration
// This ensures the profile is created in the profiles table
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, email, name } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    // Use DAL with service role for profile creation (system operation)
    const dal = new DataAccessLayer({
      useServiceRole: true,
      requireUserId: false, // We're providing userId explicitly
      autoTimestamps: true,
    });

    // Check if profile already exists
    const existingProfile = await dal.getSingle("profiles", { id: userId });

    if (existingProfile) {
      return NextResponse.json({
        message: "Profile already exists",
        profile: existingProfile,
      });
    }

    // Create profile
    const { data: profileData, error: profileError } = await dal.insert("profiles", {
      id: userId,
      email: email,
      name: name || email.split('@')[0],
      user_id: userId, // Explicitly set user_id
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile", details: profileError.message },
        { status: 500 }
      );
    }

    const profile = Array.isArray(profileData) ? profileData[0] : profileData;

    return NextResponse.json({
      message: "Profile created successfully",
      profile: profile,
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

