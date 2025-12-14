export default function StatsSection() {
  const stats = [
    { value: '31', unit: 'Years', label: 'of experience' },
    { value: '60000+', unit: '', label: 'Publications' },
    { value: '4.8/5', unit: '', label: 'Rating on\nbiocompare.com' },
    { value: '20000+', unit: '', label: 'Antibodies' },
    { value: '2000+', unit: '', label: 'ELISA Kits' },
  ];

  return (
    <section className="bg-white px-4 md:px-8 xl:px-[60px] py-8 md:py-12 xl:py-[50px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 xl:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-[-3px]">
              <div className="text-primary-orange text-2xl md:text-3xl xl:text-[36px] font-extrabold font-body leading-tight">
                {stat.value}<span className="text-primary-orange">{stat.unit}</span>
              </div>
              <div className="text-dark-gray text-sm md:text-base font-normal font-body whitespace-pre-line leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}