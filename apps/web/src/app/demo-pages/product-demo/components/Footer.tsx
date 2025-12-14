import React from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-dark-blue text-white py-12">
      <div className="max-w-[1200px] mx-auto px-[60px]">
        <div className="grid grid-cols-5 gap-8 mb-8">
          {/* Column 1 - About */}
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-4">
              <Image
                src="/images/product-demo/logo.svg"
                alt="BOSTER"
                width={141}
                height={48}
                className="h-12 w-auto"
              />
              <p className="text-white font-mulish text-sm leading-relaxed">
                With over 30 years in the industry, our foundations always go back to maintaining quality and having a strong integrity to deliver consistent products and services. Read more
              </p>
              
              <div className="flex flex-col gap-[10px]">
                <h4 className="text-primary-orange font-mulish text-base font-bold">ABOUT US</h4>
                <div className="flex flex-col gap-[10px]">
                  {['Contact Us', 'Distributors', 'Career Opportunities', 'Terms and Conditions'].map((item) => (
                    <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-white font-mulish text-base font-bold">Follow Us</h4>
              <div className="flex items-center gap-5">
                <a href="#" className="hover:opacity-80">
                  <Facebook size={20} />
                </a>
                <a href="#" className="hover:opacity-80">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:opacity-80">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 - Products */}
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-primary-orange font-mulish text-base font-bold">PRODUCTS</h4>
              <div className="flex flex-col gap-[10px]">
                {['All Categories', 'Primary Antibodies', 'PicoKine™ ELISA Kits', 'Recombinant Proteins', 'Secondary Antibodies', 'Immunoblotting Reagents', 'IHC/IF Reagents'].map((item) => (
                  <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-primary-orange font-mulish text-base font-bold">PRODUCTS BY</h4>
              <div className="flex flex-col gap-[10px]">
                {['A-Z Genes', 'Diseases', 'Pathways'].map((item) => (
                  <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3 - Services */}
          <div className="flex flex-col gap-[10px]">
            <h4 className="text-primary-orange font-mulish text-base font-bold">SERVICES</h4>
            <div className="flex flex-col gap-[10px]">
              {['All Services', 'Recombinant Protein Expression', 'Gene Synthesis', 'AAV Packaging', 'Reporter Cell Lines', 'Custom Antibody Production', '--Rabbit Polyclonal', '--Mouse Monoclonal', '--Rabbit Monoclonal', 'Sample Testing Services', '--Singleplex ELISA', '--Multiplex ELISA', '--IHC and Immunofluorescence', '--Western Blotting', '--Compound Screening', '--Multiplex Assay'].map((item) => (
                <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 - Technical Resources */}
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-primary-orange font-mulish text-base font-bold">TECHNICAL RESOURCES</h4>
              <div className="flex flex-col gap-[10px]">
                {['All Support Contents', 'ELISA Technical Resource Center', 'Western Blot Resource Center', 'IHC/ICC Resource Center', 'Flow Cytometry Resource Center', 'ChIP eBook'].map((item) => (
                  <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-primary-orange font-mulish text-base font-bold">POPULAR PRODUCTS</h4>
              <div className="flex flex-col gap-[10px]">
                {['TNF Alpha ELISA Kit', 'IL6 ELISA Kit', 'VEGF ELISA Kit', '4% Paraformaldehyde', 'PD-L1 Antibody'].map((item) => (
                  <a key={item} href="#" className="text-white font-mulish text-sm hover:underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 5 - Contact */}
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <Mail size={22} className="text-primary-orange" />
                <h4 className="text-primary-orange font-mulish text-base font-bold uppercase">EMAIL US ON</h4>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="text-white font-mulish text-sm">Order: orders@bosterbio.com</p>
                <p className="text-white font-mulish text-sm">Sales: sales@bosterbio.com</p>
                <p className="text-white font-mulish text-sm">Support: support@bosterbio.com</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <Phone size={19} className="text-primary-orange" />
                <h4 className="text-primary-orange font-mulish text-base font-bold uppercase">CALL US ON</h4>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="text-white font-mulish text-sm">Tel: (888)466-3604</p>
                <p className="text-white font-mulish text-sm">Fax: (925)215-2184</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <MapPin size={24} className="text-primary-orange" />
                <h4 className="text-primary-orange font-mulish text-base font-bold uppercase">ADDRESS</h4>
              </div>
              <p className="text-white font-mulish text-sm leading-relaxed">
                Boster Biological Technology<br />
                3942 Valley Ave<br />
                Pleasanton, CA 94566, USA
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <p className="text-white font-mulish text-xs text-center">
            © 1993-2024 Boster Biological Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}