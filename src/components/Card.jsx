import { useState, useEffect } from 'react';

export default function Card({ char, romaji, isRevealed, onReveal }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(isRevealed);
  }, [isRevealed]);

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      onReveal();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-32 h-40 cursor-pointer perspective-1000 transition-transform duration-300 transform active:scale-95
      `}
    >
      <div className={`
        w-full h-full duration-500 preserve-3d absolute
        ${flipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front (Character) */}
        <div className="absolute backface-hidden w-full h-full bg-slate-800 rounded-xl border border-slate-700 shadow-xl flex items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {char}
          </span>
        </div>

        {/* Back (Romaji) */}
        <div className="absolute backface-hidden w-full h-full bg-slate-800 rounded-xl border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center rotate-y-180">
          <span className="text-4xl font-bold text-white mb-2">{char}</span>
          <span className="text-xl font-medium text-indigo-300">{romaji}</span>
        </div>
      </div>
    </div>
  );
}
