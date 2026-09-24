import React from 'react';
import { Star, CheckCircle2, ShieldCheck, Quote } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const ReviewsSection: React.FC = () => {
  const testimonials = [
    {
      id: 'rev-1',
      author: 'Vikram S.',
      location: 'Dehradun, Uttarakhand',
      boot: 'RANVIK Ranger X1',
      rating: 5,
      headline: 'BEST COMBAT BOOTS I HAVE OWNED',
      text: "Best combat boots I've owned. Solid build, broke in fast and looks incredible with raw selvedge jeans. The grip on loose shale and wet tarmac is rock solid.",
      date: '2 weeks ago',
    },
    {
      id: 'rev-2',
      author: 'Col. Rajesh Verma (Retd.)',
      location: 'Chandigarh',
      boot: 'RANVIK Tactical Core',
      rating: 5,
      headline: 'AUTHENTIC MILITARY ATTITUDE & REAL COMFORT',
      text: 'Having worn combat boots for over 28 years, most online boots feel like plastic toys. RANVIK got the bovine leather density, ankle padding, and steel shank support exactly right.',
      date: '1 month ago',
    },
    {
      id: 'rev-3',
      author: 'Aditya K.',
      location: 'Bengaluru, Karnataka',
      boot: 'RANVIK Command 8',
      rating: 5,
      headline: 'EXCEPTIONAL VALUE FOR FULL-GRAIN LEATHER',
      text: 'I ride an Interceptor 650 on weekends. The reinforced shifter toe patch and high shaft keep my ankles protected. People constantly ask if these are imported luxury boots.',
      date: '3 weeks ago',
    },
  ];

  return (
    <section
      id="reviews-section"
      className="w-full bg-[#F7F6F2] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E2E0DA]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#E2E0DA]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#626653] uppercase tracking-[0.25em] mb-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#626653]" />
              <span>VERIFIED CUSTOMER FIELD DISPATCHES</span>
            </div>
            <h2 className="font-condensed font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#181818] leading-none">
              TESTED IN THE FIELD
            </h2>
            <p className="text-sm sm:text-base text-[#65625B] mt-2">
              Real feedback from riders, travelers, and boot enthusiasts across India.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-3 font-mono text-xs bg-[#FFFFFF] border border-[#E2E0DA] px-4 py-2.5 shadow-xs">
            <div className="flex items-center text-[#D97706]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D97706]" />
              ))}
            </div>
            <span className="text-[#181818] font-bold text-sm">{siteConfig.reviewsSummary.rating} / 5.0</span>
            <span className="text-[#77746D]">({siteConfig.reviewsSummary.totalReviews}+ Reviews Verified)</span>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#FFFFFF] border border-[#E2E0DA] p-6 sm:p-8 flex flex-col justify-between hover:border-[#181818] transition-all duration-200 shadow-xs hover:shadow-md relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#E8E6E0] pointer-events-none" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-[#D97706] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D97706]" />
                  ))}
                </div>

                {/* Headline */}
                <h3 className="font-condensed font-bold text-xl uppercase tracking-wide text-[#181818] mb-3">
                  "{t.headline}"
                </h3>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#55524B] leading-relaxed mb-6">
                  {t.text}
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 border-t border-[#EFECE6] font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#181818] text-sm">{t.author}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#626653] bg-[#E8E6E0] px-2 py-0.5 border border-[#D9D7D0] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-[#626653]" />
                    VERIFIED BUYER
                  </span>
                </div>

                <p className="text-[#77746D] text-[11px]">{t.location}</p>
                <div className="flex items-center justify-between text-[11px] text-[#626653] mt-2 pt-2 border-t border-[#EFECE6] font-medium">
                  <span className="truncate">{t.boot}</span>
                  <span className="text-[#8C8982] shrink-0">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
