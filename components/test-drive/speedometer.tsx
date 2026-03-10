"use client";

export function Speedometer({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  const percentage = (speed / maxSpeed) * 100;
  const rotation = (percentage / 100) * 240 - 120;

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
          strokeDasharray="565.48"
          strokeDashoffset="188.49"
          strokeLinecap="round"
          transform="rotate(150 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="8"
          strokeDasharray="565.48"
          strokeDashoffset={565.48 - (percentage / 100) * 376.99}
          strokeLinecap="round"
          transform="rotate(150 100 100)"
          className="transition-all duration-100"
        />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA9B2" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotation} 100 100)`}
          className="transition-transform duration-100 drop-shadow-lg"
        />
        <circle cx="100" cy="100" r="12" fill="#1e293b" className="dark:fill-slate-200" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
          {Math.round(speed)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">km/h</span>
      </div>
    </div>
  );
}
