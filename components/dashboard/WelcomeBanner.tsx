"use client";

interface WelcomeBannerProps {
  farmerName: string;
  farmName: string;
  location: string;
  rating: number;
  todayRevenue: string;
}

const T = {
  primary: "#1A3020",
  success: "#3E7B27",
  gold: "#F2B441",
  cardBg: "#FFFFFF",
} as const;

export default function WelcomeBanner({
  farmerName,
  farmName,
  location,
  rating,
  todayRevenue,
}: WelcomeBannerProps) {
  return (
    <div
      className="rounded-3xl px-6 py-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${T.primary} 0%, #0D2416 100%)`,
        border: "1px solid rgba(62,123,39,0.3)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(62,123,39,0.18) 0%, transparent 65%)",
        }}
      />
      {["🌿", "🍃", "🌱"].map((leaf, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            right: `${10 + i * 9}%`,
            top: `${8 + i * 22}%`,
            fontSize: `${1.5 - i * 0.2}rem`,
            opacity: 0.2,
            animation: "floatLeaf 6s ease-in-out infinite",
            animationDelay: `${i * 1.1}s`,
          }}
        >
          {leaf}
        </span>
      ))}

      <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-green-400/70 text-sm font-medium mb-1">
            🌄 Good morning,
          </p>
          <h1
            className="text-white text-2xl lg:text-3xl font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {farmerName}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {farmName} · {location}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center hidden sm:block">
            <p className="text-white/40 text-xs mb-0.5">Today's Revenue</p>
            <p className="text-white text-xl font-bold">{todayRevenue}</p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div
            className="px-4 py-2 rounded-2xl flex items-center gap-2"
            style={{
              background: "rgba(242,180,65,0.12)",
              border: `1px solid ${T.gold}40`,
            }}
          >
            <span className="text-lg">⭐</span>
            <div>
              <p className="text-yellow-400 font-bold text-sm leading-tight">
                {rating}
              </p>
              <p className="text-white/40 text-[10px]">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatLeaf {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(7deg);
          }
        }
      `}</style>
    </div>
  );
}
