import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryMedium } from 'lucide-react';

interface AndroidStatusBarProps {
  darkText?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ darkText = false }) => {
  const [currentTime, setCurrentTime] = useState<string>('08:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkText ? 'text-slate-800' : 'text-slate-700 dark:text-slate-200';

  return (
    <div className={`h-8 px-6 flex items-center justify-between text-xs font-semibold select-none ${textColor} tracking-tight z-30 transition-colors`}>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[13px] font-bold">{currentTime}</span>
      </div>

      {/* Front camera punch hole center simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-slate-900/90 dark:bg-black border border-slate-700/30 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-950/80"></div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-wider opacity-85">5G</span>
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono font-medium">96%</span>
          <BatteryMedium size={14} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};
