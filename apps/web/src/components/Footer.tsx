import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const productLinks = [
    'All Categories',
    'Primary Antibodies',
    'PicoKine™ ELISA Kits',
    'Recombinant Proteins',
    'Secondary Antibodies',
    'Immunoblotting Reagents',
    'IHC/IF Reagents',
  ];

  const productsByLinks = ['A-Z Genes', 'Diseases', 'Pathways'];

  const serviceLinks = [
    'All Services',
    'Recombinant Protein Expression',
    'Gene Synthesis',
    'AAV Packaging',
    'Reporter Cell Lines',
    'Custom Antibody Production',
    '--Rabbit Polyclonal',
    '--Mouse Monoclonal',
    '--Rabbit Monoclonal',
    'Sample Testing Services',
    '--Singleplex ELISA',
    '--Multiplex ELISA',
    '--IHC and Immunofluorescence',
    '--Western Blotting',
    '--Compound Screening',
    '--Multiplex Assay',
  ];

  const resourceLinks = [
    'All Support Contents',
    'ELISA Technical Resource Center',
    'Western Blot Resource Center',
    'IHC/ICC Resource Center',
    'Flow Cytometry Resource Center',
    'ChIP eBook',
  ];

  const popularProducts = [
    'TNF Alpha ELISA Kit',
    'IL6 ELISA Kit',
    'VEGF ELISA Kit',
    '4% Paraformaldehyde',
    'PD-L1 Antibody',
  ];

  const aboutLinks = [
    'Contact Us',
    'Distributors',
    'Career Opportunities',
    'Terms and Conditions',
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#06316e] to-[#3d87d2] text-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 md:gap-10 xl:gap-[30px] mb-8 xl:mb-[40px]">
          {/* Column 1: About & Social */}
          <div className="flex flex-col gap-6 xl:gap-[16px]">
            <div className="flex flex-col gap-4 xl:gap-[16px]">
              <Image
                src="/icons/footer-logo.svg"
                alt="Boster Bio"
                width={141}
                height={48}
                className="w-auto h-10 xl:h-12"
              />
              <p className="text-white text-sm font-normal font-body leading-relaxed xl:leading-[16.8px]">
                With over 30 years in the industry, our foundations always go back to maintaining quality and having a strong integrity to deliver consistent products and services. Read more
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                ABOUT US
              </h3>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                {aboutLinks.map((link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                Follow Us
              </h3>
              <div className="flex gap-4 xl:gap-[20px]">
                <Link href="https://facebook.com" className="text-white hover:text-primary-orange transition-colors">
                  <Facebook size={20} />
                </Link>
                <Link href="https://twitter.com" className="text-white hover:text-primary-orange transition-colors">
                  <Twitter size={20} />
                </Link>
                <Link href="https://linkedin.com" className="text-white hover:text-primary-orange transition-colors">
                  <Linkedin size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="flex flex-col gap-6 xl:gap-[30px]">
            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                PRODUCTS
              </h3>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                {productLinks.map((link) => (
                  <Link
                    key={link}
                    href={`/products/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                PRODUCTS BY
              </h3>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                {productsByLinks.map((link) => (
                  <Link
                    key={link}
                    href={`/products/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-3 xl:gap-[10px]">
            <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
              SERVICES
            </h3>
            <div className="flex flex-col gap-2 xl:gap-[10px]">
              {serviceLinks.map((link) => (
                <Link
                  key={link}
                  href={`/services/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Resources & Popular Products */}
          <div className="flex flex-col gap-6 xl:gap-[30px]">
            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                TECHNICAL RESOURCES
              </h3>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                {resourceLinks.map((link) => (
                  <Link
                    key={link}
                    href={`/resources/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px]">
                POPULAR PRODUCTS
              </h3>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                {popularProducts.map((product) => (
                  <Link
                    key={product}
                    href={`/products/${product.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px] hover:text-primary-orange transition-colors"
                  >
                    {product}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 5: Contact */}
          <div className="flex flex-col gap-6 xl:gap-[30px]">
            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <div className="flex items-center gap-2 xl:gap-[10px]">
                <Mail size={22} className="text-primary-orange" />
                <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px] uppercase">
                  Email us on
                </h3>
              </div>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                <p className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px]">
                  Order: orders@bosterbio.com
                </p>
                <p className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px]">
                  Sales: sales@bosterbio.com
                </p>
                <p className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px]">
                  Support: support@bosterbio.com
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <div className="flex items-center gap-2 xl:gap-[10px]">
                <Phone size={22} className="text-primary-orange" />
                <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px] uppercase">
                  Call us on
                </h3>
              </div>
              <div className="flex flex-col gap-2 xl:gap-[10px]">
                <p className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px]">
                  Tel: (888)466-3604
                </p>
                <p className="text-white text-sm font-normal font-body leading-tight xl:leading-[16.8px]">
                  Fax: (925)215-2184
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:gap-[10px]">
              <div className="flex items-center gap-2 xl:gap-[10px]">
                <MapPin size={22} className="text-primary-orange" />
                <h3 className="text-primary-orange text-base font-bold font-body leading-tight xl:leading-[19.2px] uppercase">
                  Address
                </h3>
              </div>
              <p className="text-white text-sm font-normal font-body leading-relaxed xl:leading-[16.8px]">
                Boster Biological Technology<br />
                3942 Valley Ave<br />
                Pleasanton, CA 94566, USA
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 xl:pt-8 border-t border-white/20">
          <p className="text-white text-xs font-normal font-body tracking-tight">
            © 1993-2024 Boster Biological Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}