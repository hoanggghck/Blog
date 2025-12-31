import { getSeason } from '@/lib/season';
import { cn } from '@/lib/utils';

export default function SeasonalHeaderBackground() {
  const season = getSeason();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-r',
        season.gradientFrom,
        season.gradientTo,
      )} />

      {/* White overlay at the bottom so particles appear on top */}
      <div className="absolute inset-0 bg-white/65 backdrop-blur-md z-10" />

      {/* Winter effects - Falling snow */}
      {season.season === 'winter' && (
        <>
          <style>{`
            @keyframes snowfall {
              0% {
                transform: translateY(-10px) translateX(0);
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translateY(70px) translateX(var(--tx, 0px));
                opacity: 0;
              }
            }
            .snow {
              animation: snowfall linear infinite;
              will-change: transform;
            }
          `}</style>

          {[...Array(40)].map((_, i) => {
            const size = Math.random();
            const duration = 2 + Math.random() * 2;
            const delay = Math.random() * 1.5;
            const left = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 40;

            let width = 3;
            let height = 3;
            let blur = 2;

            if (size > 0.7) {
              width = 6;
              height = 6;
              blur = 4;
            } else if (size > 0.4) {
              width = 4;
              height = 4;
              blur = 3;
            }

            return (
              <div
                key={`snow-${i}`}
                className="snow absolute pointer-events-none bg-white rounded-full"
                style={{
                  left: `${left}%`,
                  top: '-10px',
                  width: `${width}px`,
                  height: `${height}px`,
                  '--tx': `${tx}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  opacity: 0.9,
                  boxShadow: `0 0 ${blur}px rgba(255, 255, 255, 0.9), inset 0 0 ${blur}px rgba(255, 255, 255, 0.5)`,
                  zIndex: 20,
                } as React.CSSProperties}
              />
            );
          })}
        </>
      )}

      {/* Spring effects - Floating flower petals */}
      {season.season === 'spring' && (
        <>
          <style>{`
            @keyframes petal-fall {
              0% {
                transform: translateY(-10px) translateX(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(70px) translateX(var(--tx, 20px)) rotate(360deg);
                opacity: 0;
              }
            }
            .petal {
              animation: petal-fall ease-in infinite;
              will-change: transform;
            }
          `}</style>

          {[...Array(30)].map((_, i) => {
            const duration = 2.5 + Math.random() * 1.5;
            const delay = Math.random() * 1.5;
            const left = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 35;
            const colors = ['#fda4af', '#fbcfe8', '#f472b6', '#ec4899'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={`petal-${i}`}
                className="petal absolute pointer-events-none"
                style={{
                  width: '6px',
                  height: '6px',
                  background: color,
                  borderRadius: '50% 0 50% 50%',
                  left: `${left}%`,
                  top: '-10px',
                  '--tx': `${tx}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  zIndex: 20,
                } as React.CSSProperties}
              />
            );
          })}
        </>
      )}

      {/* Summer effects - Sunlight and particles */}
      {season.season === 'summer' && (
        <>
          <style>{`
            @keyframes sun-pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.4;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.6;
              }
            }
            .sun-core {
              animation: sun-pulse 3s ease-in-out infinite;
            }
            @keyframes light-float {
              0% {
                transform: translateY(-10px) translateX(0) scale(1);
                opacity: 1;
              }
              100% {
                transform: translateY(70px) translateX(var(--tx, 20px)) scale(0.5);
                opacity: 0;
              }
            }
            .light {
              animation: light-float ease-out infinite;
              will-change: transform;
            }
          `}</style>

          {/* Large sun glow - kept subtle */}
          <div className="sun-core absolute top-0 right-1/4 w-32 h-32 bg-yellow-300 rounded-full opacity-30 blur-2xl" />

          {/* Light particles */}
          {[...Array(35)].map((_, i) => {
            const duration = 2 + Math.random() * 1.5;
            const delay = Math.random() * 1.5;
            const left = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 40;
            const size = 2 + Math.random() * 3;

            return (
              <div
                key={`light-${i}`}
                className="light absolute pointer-events-none bg-white rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-10px',
                  '--tx': `${tx}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 150, 0.8)`,
                  zIndex: 20,
                } as React.CSSProperties}
              />
            );
          })}
        </>
      )}

      {/* Autumn effects - Falling leaves */}
      {season.season === 'autumn' && (
        <>
          <style>{`
            @keyframes leaf-fall {
              0% {
                transform: translateY(-10px) translateX(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(70px) translateX(var(--tx, 30px)) rotate(var(--rot, 360deg));
                opacity: 0;
              }
            }
            .leaf {
              animation: leaf-fall ease-in infinite;
              will-change: transform;
            }
          `}</style>

          {[...Array(35)].map((_, i) => {
            const duration = 2.5 + Math.random() * 1.5;
            const delay = Math.random() * 1.5;
            const left = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 40;
            const rot = 180 + Math.random() * 360;
            const hues = [15, 25, 35, 0]; // red, orange tones
            const hue = hues[Math.floor(Math.random() * hues.length)];
            const size = 5 + Math.random() * 4;

            return (
              <div
                key={`leaf-${i}`}
                className="leaf absolute pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `hsl(${hue}, 85%, 50%)`,
                  borderRadius: '50% 0 50% 50%',
                  left: `${left}%`,
                  top: '-10px',
                  '--tx': `${tx}px`,
                  '--rot': `${rot}deg`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 1px 2px rgba(0, 0, 0, 0.2)`,
                  zIndex: 20,
                } as React.CSSProperties}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
