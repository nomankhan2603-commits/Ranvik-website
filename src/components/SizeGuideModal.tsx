import React from 'react';
import { X, Ruler, Footprints, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { uk: 6, us: 7, eu: 40, cm: 24.5, inches: 9.6 },
    { uk: 7, us: 8, eu: 41, cm: 25.5, inches: 10.0 },
    { uk: 8, us: 9, eu: 42, cm: 26.5, inches: 10.4 },
    { uk: 9, us: 10, eu: 43, cm: 27.5, inches: 10.8 },
    { uk: 10, us: 11, eu: 44, cm: 28.5, inches: 11.2 },
    { uk: 11, us: 12, eu: 45, cm: 29.5, inches: 11.6 },
  ];

  return (
    <div
      id="size-guide-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto rounded-xs text-[#181818]">
        {/* Close Button */}
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-5 right-5 p-2 text-[#77746D] hover:text-[#181818] transition-colors"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Ruler className="w-5 h-5 text-[#626653]" />
          <h3 className="font-condensed font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#181818]">
            RANVIK SIZING MATRIX
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#55524B] mb-6">
          RANVIK boots follow standard Indian / UK footwear sizing. All measurements correspond to bare foot length.
        </p>

        {/* Conversion Table */}
        <div className="overflow-x-auto mb-8 border border-[#E2E0DA]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#F7F6F2] text-[#181818] uppercase border-b border-[#E2E0DA]">
              <tr>
                <th className="py-3 px-4 text-[#181818] font-bold">UK / India</th>
                <th className="py-3 px-4">US Men</th>
                <th className="py-3 px-4">EU</th>
                <th className="py-3 px-4">Foot (CM)</th>
                <th className="py-3 px-4">Foot (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0DA] text-[#55524B]">
              {sizeChart.map((row) => (
                <tr key={row.uk} className="hover:bg-[#F7F6F2] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#181818] bg-[#F7F6F2]/60">
                    UK {row.uk}
                  </td>
                  <td className="py-3 px-4">US {row.us}</td>
                  <td className="py-3 px-4">EU {row.eu}</td>
                  <td className="py-3 px-4 text-[#181818] font-medium">{row.cm} cm</td>
                  <td className="py-3 px-4">{row.inches}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Steps */}
        <div className="bg-[#F7F6F2] border border-[#E2E0DA] p-5 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#181818] mb-3 font-bold">
            <Footprints className="w-4 h-4 text-[#626653]" />
            <span>HOW TO MEASURE ACCURATELY</span>
          </div>
          <ol className="space-y-2 text-xs text-[#55524B] list-decimal list-inside leading-relaxed">
            <li>Place a clean sheet of paper on a hard floor against a wall.</li>
            <li>Step on the paper with your heel lightly touching the wall, wearing the socks you plan to wear with the boots.</li>
            <li>Mark the tip of your longest toe with a pencil held vertically.</li>
            <li>Measure the distance from the paper edge to your pencil mark in centimeters.</li>
          </ol>
        </div>

        {/* Fit Guidelines */}
        <div className="space-y-2.5 text-xs text-[#55524B]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <span><strong>Between sizes?</strong> If you wear heavy wool socks or have wider feet, we recommend ordering one size up.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <span><strong>Break-In Period:</strong> Genuine 1.8mm full-grain leather requires 2–4 days of regular wear to mold naturally to your feet.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <span><strong>Hassle-Free Replacement:</strong> Free size exchanges within 7 days of delivery across all Indian PIN codes.</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#E2E0DA] text-right">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider shadow-xs"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
