import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

export default function BlogSection() {
  const blogs = [
    {
      image: '/images/blog-1.jpg',
      date: '2024.04.18',
      title: 'Monoclonal Vs Polyclonal Antibodies',
      description: 'Choosing Between Polyclonal And Monoclonal Antibodies Is Crucial For Experiment Success.',
      link: '/blog/monoclonal-vs-polyclonal',
    },
    {
      image: '/images/blog-2.jpg',
      date: '2024.04.04',
      title: 'AACR Annual Meeting 2024',
      description: 'The 2024 AACR Annual Meeting is coming up soon! Join us in San Diego from April 5-10 for the annual event.',
      link: '/blog/aacr-2024',
    },
    {
      image: '/images/blog-3.png',
      date: '2024.03.08',
      title: '2024 SOT Annual Meeting',
      description: 'Meet us in Salt Lake City from March 10-14 at the Society of Toxicology (SOT) 63rd Annual Meeting and ToxExpo!',
      link: '/blog/sot-2024',
    },
  ];

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] 2xl:px-[240px] 3xl:px-[300px] py-12 md:py-16 xl:py-[60px]">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 xl:mb-[30px]">
          <h2 className="text-primary-dark-blue text-2xl md:text-3xl xl:text-[42px] font-bold font-heading mb-2">
            Boster Bio Life Science Blog
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-[533px] h-[11px] border-t-[0.75px] border-primary-orange" />
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-[24px] mb-6 xl:mb-[30px]">
          {blogs.map((blog, index) => (
            <Link
              key={index}
              href={blog.link}
              className="bg-white rounded-[60px_0_0_0] shadow-lg overflow-hidden flex flex-col cursor-pointer hover:-translate-y-2 transition-transform group"
            >
              {/* Image */}
              <div className="relative w-full h-[200px] md:h-[220px] xl:h-[223px] rounded-[0_0_60px_0] overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 xl:p-[24px_20px] flex flex-col gap-4 xl:gap-[18px] flex-1">
                <p className="text-medium-gray text-sm font-normal font-body leading-tight tracking-tight">
                  {blog.date}
                </p>
                
                <div className="flex flex-col gap-2 xl:gap-[10px] flex-1">
                  <h3 className="text-primary-orange text-xl md:text-2xl xl:text-[28px] font-bold font-body leading-tight xl:leading-[33.6px] tracking-tight">
                    {blog.title}
                  </h3>
                  <p className="text-medium-gray text-sm md:text-base font-normal font-body leading-relaxed xl:leading-[22.4px] tracking-tight">
                    {blog.description}
                  </p>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex justify-end p-5 md:p-6 xl:p-[21px_22px]">
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