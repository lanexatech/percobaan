
import React from 'react';

export const ButterflySpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <style>{`
      @keyframes flutter {
        0%, 100% { transform: scaleY(1) rotate(-10deg); }
        50% { transform: scaleY(0.8) rotate(10deg); }
      }
      @keyframes body-bob {
        0%, 100% { transform: translateY(-3px); }
        50% { transform: translateY(3px); }
      }
      .wing { animation: flutter 0.7s ease-in-out infinite; }
      .wing-left { transform-origin: right center; }
      .wing-right { transform-origin: left center; }
      .body { animation: body-bob 1s ease-in-out infinite; }
    `}</style>
    <svg width="100" height="100" viewBox="0 0 100 100" className="text-red-500">
      <g className="body">
        <ellipse cx="50" cy="50" rx="4" ry="15" fill="currentColor" />
      </g>
      <path d="M50 35 C 10 20, 10 80, 50 65" fill="currentColor" fillOpacity="0.8" className="wing wing-left" />
      <path d="M50 35 C 90 20, 90 80, 50 65" fill="currentColor" fillOpacity="0.8" className="wing wing-right" />
    </svg>
  </div>
);
