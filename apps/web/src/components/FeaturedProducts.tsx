import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

export default function FeaturedProducts() {
  const products = [
    {
      image: '/images/product-box-1.svg',
      title: 'Anti-Bobtail Squid ADAR2 Antibody',
      details: [
        { label: 'SKU', value: 'DZ41545' },
        { label: 'Host', value: 'Rabbit' },
        { label: 'Application', value: 'Bobtail Squid' },
        { label: 'Size', value: '200 μl/vial' },
      ],
      link: '/products/dz41545',
    },
    {
      image: '/images/product-box-2.svg',
      title: 'Product Info Summary',
      details: [
        { label: 'SKU', value: 'DZ41526' },
        { label: 'Host', value: 'Rabbit' },
        { label: 'Application', value: 'Flow Cytometry' },
        { label: 'Size', value: '1 ml' },
      ],
      link: '/products/dz41526',
    },
  ];

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 xl:mb-[30px]">
          <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-1">
            Featured products
          </h2>
          <div className="flex justify-center">
            <Image
              src="/icons/underline-orange.svg"
              alt=""
              width={353}
              height={27}
              className="w-auto h-auto"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 xl:gap-[24px] mb-6 xl:mb-[30px]">
          {products.map((product, index) => (
            <Link
              key={index}
              href={product.link}
              className="bg-white rounded-[60px_0_0_0] shadow-lg p-4 md:p-5 xl:p-[20px] flex flex-col md:flex-row gap-4 xl:gap-[20px] items-center cursor-pointer hover:-translate-y-1 transition-transform group"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-full md:w-[230px] h-[200px] md:h-[230px] relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col gap-3 xl:gap-[10px]">
                <h3 className="text-primary-orange text-lg md:text-xl font-bold font-body leading-tight xl:leading-6">
                  {product.title}
                </h3>
                
                <div className="text-medium-gray text-sm md:text-base font-normal font-body leading-relaxed tracking-tight">
                  {product.details.map((detail, i) => (
                    <div key={i}>
                      <span className="font-bold">{detail.label}:</span> {detail.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0">
                <div className="w-6 h-6 flex items-center justify-center bg-primary-light-blue rounded group-hover:bg-primary-orange transition-colors">
                  <ArrowDownRight size={16} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button className="bg-transparent border border-primary-orange rounded-full px-5 py-2 xl:py-[10px] flex items-center gap-2 xl:gap-[13px] text-primary-orange text-sm md:text-base font-normal font-body cursor-pointer hover:bg-primary-orange hover:text-white transition-all">
            <span>View All</span>
            <ArrowDownRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}