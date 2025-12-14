import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import Sidebar from './Sidebar';

export default function ProductDetails() {
  return (
    <div className="flex gap-6 mb-[60px]">
      <div className="flex-1 flex flex-col gap-[30px]">
        <CollapsibleSection
          title="Product Info"
          defaultOpen={true}
          content={
            <div className="flex flex-col">
              <div className="bg-light-gray flex">
                <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                  <span className="text-primary-light-blue font-mulish text-base font-bold">Product Name</span>
                </div>
                <div className="flex-1 p-[10px]">
                  <p className="text-medium-gray font-mulish text-base leading-snug">
                    Anti-Macrosialin CD68 Antibody
                    <br />
                    <a href="#" className="text-primary-light-blue hover:underline">View all CD68/SR-D1 Antibodies</a>
                  </p>
                </div>
              </div>
              <div className="border-t border-[#C4C4C4]" />
              
              <div className="flex">
                <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                  <span className="text-primary-light-blue font-mulish text-base font-bold">SKU/Catalog Number</span>
                </div>
                <div className="flex-1 p-[10px]">
                  <span className="text-medium-gray font-mulish text-base">PA1518</span>
                </div>
              </div>
              <div className="border-t border-[#C4C4C4]" />
              
              <div className="bg-light-gray flex">
                <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                  <span className="text-primary-light-blue font-mulish text-base font-bold">Size</span>
                </div>
                <div className="flex-1 p-[10px]">
                  <span className="text-medium-gray font-mulish text-base">100 μg/vial</span>
                </div>
              </div>
              <div className="border-t border-[#C4C4C4]" />
              
              <div className="flex">
                <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                  <span className="text-primary-light-blue font-mulish text-base font-bold">Form</span>
                </div>
                <div className="flex-1 p-[10px]">
                  <span className="text-medium-gray font-mulish text-base">Lyophilized</span>
                </div>
              </div>
              <div className="border-t border-[#C4C4C4]" />
              
              <div className="bg-light-gray flex">
                <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                  <span className="text-primary-light-blue font-mulish text-base font-bold">Description</span>
                </div>
                <div className="flex-1 p-[10px]">
                  <p className="text-medium-gray font-mulish text-base leading-snug">
                    Superstar antibody: Boster's anti mouse CD68 antibody (PA1518) is among its top 10 bestselling antibodies, and one of the most cited mouse/rat CD68 antibodies on the market. Because of this antibody's high demand, we have subsequently developed a rabbit monoclonal anti CD68 antibody (M00602-1) targetting a similar epitope.
                    <br /><br />
                    High specificity: PA1518 reacts with murine macrosialin/CD68, and has been validated with Western blotting and confirmed its stellar specificity. CD68 is a highly glycosylated protein, and its expected western blot molecular weight is between 80kDa to 110kDa, depending on glycosylation level. PA1518's observed MW in WB is near 90-100kDa.
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <CollapsibleSection
          title="Assay Dilution & Images"
          defaultOpen={false}
          content={
            <div className="flex flex-col gap-5">
              <p className="text-medium-gray font-mulish text-base leading-snug">
                The recommendations below provide a starting point for assay optimization. The actual working concentration varies and should be decided by the user.
              </p>
              
              <div className="border border-[#C4C4C4] rounded">
                <div className="bg-primary-light-blue text-white flex">
                  <div className="w-[110px] p-[10px] border-r border-white flex items-center">
                    <span className="font-mulish text-base font-bold">Validated Application</span>
                  </div>
                  <div className="w-[110px] p-[10px] border-r border-white flex items-center">
                    <span className="font-mulish text-base font-bold">Primary Antibody Dilution</span>
                  </div>
                  <div className="w-[110px] p-[10px] border-r border-white flex items-center">
                    <span className="font-mulish text-base font-bold">Validated Species</span>
                  </div>
                  <div className="flex-1 p-[10px] flex items-center">
                    <span className="font-mulish text-base font-bold">Positive Tissues</span>
                  </div>
                </div>
                
                {[
                  { app: 'WB', dilution: '0.1-0.5ug/ml', species: 'Mouse, Rabbit', tissues: 'rat spleen tissue, mouse spleen tissue, mouse RAW2647 whole cell' },
                  { app: 'IHC', dilution: '2-5ug/ml', species: 'Human, Rabbit', tissues: 'mouse liver tissue, mouse spleen tissue, rat spleen tissue, rat lung tissue' },
                  { app: 'IF', dilution: '5ug/ml', species: 'Mouse', tissues: 'mouse spleen tissue' },
                  { app: 'FCM', dilution: '1-3ug/1x106 cells', species: 'Mouse', tissues: 'RAW2647 cell' },
                ].map((row, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? '' : 'bg-light-gray'}`}>
                    <div className="w-[110px] p-[10px] border-r border-[#C4C4C4] border-t">
                      <span className="text-primary-light-blue font-mulish text-base font-bold">{row.app}</span>
                    </div>
                    <div className="w-[110px] p-[10px] border-r border-[#C4C4C4] border-t">
                      <span className="text-medium-gray font-mulish text-base">{row.dilution}</span>
                    </div>
                    <div className="w-[110px] p-[10px] border-r border-[#C4C4C4] border-t">
                      <span className="text-medium-gray font-mulish text-base">{row.species}</span>
                    </div>
                    <div className="flex-1 p-[10px] border-t border-[#C4C4C4]">
                      <span className="text-medium-gray font-mulish text-base">{row.tissues}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <CollapsibleSection
          title="Protein Target Info & Infographic"
          defaultOpen={false}
          content={
            <div className="flex flex-col gap-5">
              <h3 className="text-primary-orange font-mulish text-[28px] font-bold">
                Gene/Protein Information For CD68 (Source: Uniprot.Org, NCBI)
              </h3>
              
              <div className="border border-[#C4C4C4] rounded">
                {[
                  { label: 'Gene Name', value: 'CD68' },
                  { label: 'Full Name', value: 'Macrosialin' },
                  { label: 'Weight', value: '34818 MW' },
                  { label: 'Superfamily', value: 'LAMP family' },
                ].map((row, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? 'bg-light-gray' : ''}`}>
                    <div className="w-[190px] p-[10px] border-r border-[#C4C4C4]">
                      <span className="text-primary-light-blue font-mulish text-base font-bold">{row.label}</span>
                    </div>
                    <div className="flex-1 p-[10px]">
                      <span className="text-medium-gray font-mulish text-base">{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>

      <Sidebar />
    </div>
  );
}