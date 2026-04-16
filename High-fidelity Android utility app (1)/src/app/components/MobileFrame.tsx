import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative">
        {/* Phone Bezel */}
        <div className="relative w-[390px] h-[844px] bg-[#0a0a0a] rounded-[3rem] p-3 shadow-2xl border-8 border-[#1a1a1a]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#0a0a0a] rounded-b-3xl z-10 flex items-end justify-center pb-1">
            <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full" />
          </div>
          
          {/* Screen */}
          <div className="relative w-full h-full bg-[#181818] rounded-[2.5rem] overflow-hidden">
            {children}
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
        </div>
        
        {/* Phone Shadow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#B0FC51]/5 to-transparent blur-3xl" />
      </div>
    </div>
  );
}
