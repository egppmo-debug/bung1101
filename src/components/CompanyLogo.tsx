import React, { useState } from 'react';
import purpleLogoPath from '../assets/images/hanwha_purple_logo_1788646069908.jpg';

interface CompanyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const ringStroke = 'stroke-white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-[#7C3AED] via-[#6B21A8] to-[#4C1D95] flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src={purpleLogoPath}
            alt="한화피플라이프 로고"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* SVG Vector Fallback in Purple Tone */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5 drop-shadow"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background deep purple gradient */}
            <rect width="100" height="100" rx="20" fill="url(#purpleGrad)" />
            {/* Three intersecting Hanwha rings */}
            <g transform="translate(5, 5)">
              {/* Main large slanted oval */}
              <ellipse
                cx="45"
                cy="42"
                rx="35"
                ry="24"
                transform="rotate(-28 45 42)"
                stroke="#FFFFFF"
                strokeWidth="5"
                fill="none"
              />
              {/* Second ring */}
              <circle
                cx="52"
                cy="54"
                r="19"
                stroke="rgba(243, 232, 255, 0.75)"
                strokeWidth="4.5"
                fill="none"
              />
              {/* Third interlocking ring */}
              <circle
                cx="58"
                cy="52"
                r="18"
                stroke="rgba(233, 213, 255, 0.55)"
                strokeWidth="4"
                fill="none"
              />
            </g>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#6D28D9" />
                <stop offset="1" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-tight text-slate-800">
            한화피플라이프
          </span>
          <span className="text-[10px] font-semibold text-purple-700 tracking-tighter">
            대전글로리사업단
          </span>
        </div>
      )}
    </div>
  );
};
