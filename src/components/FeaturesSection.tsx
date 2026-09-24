import React from 'react';
import { Shield, Disc, HeartPulse, Compass } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const iconMap: Record<string, React.ElementType> = {
  '01': Shield,
  '02': Disc,
  '03': HeartPulse,
  '04': Compass,
};

const specMap: Record<string, string> = {
  '01': '1.8–2.0mm Full-Grain Bovine Hides',
  '02': 'High-Density Deep Lug Rubber',
  '03': 'Orthotic PU Footbed & Steel Shank',
  '04': 'Weather-Sealed Tongue & Speed Hooks',
};

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features-section"
      className="w-full bg-[#EFECE6] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2DFD7]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.features.map((item) => {
            const IconComponent = iconMap[item.number] || Shield;
            const specText = specMap[item.number] || 'Field Tested Construction';
            return (
              <div
                key={item.number}
                className="group relative p-6 sm:p-7 bg-[#FFFFFF] border border-[#E2E0DA] hover:border-[#181818] transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Number and Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#626653]">
                      {item.number}
                    </span>
                    <div className="p-2.5 bg-[#F7F6F2] border border-[#E8E6E0] rounded-xs text-[#181818] group-hover:bg-[#181818] group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-condensed font-bold text-2xl uppercase tracking-wider text-[#181818] mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#65625B] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Sub-spec pill */}
                <div className="pt-4 border-t border-[#EFECE6]">
                  <span className="font-mono text-[11px] uppercase text-[#77746D] tracking-wider block">
                    {specText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
