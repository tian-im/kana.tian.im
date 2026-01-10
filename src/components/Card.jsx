import { useState, useEffect } from 'react';

export default function Card({ char, romaji, origin, isRevealed, onReveal, size = 'normal', scale = 1 }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(isRevealed);
  }, [isRevealed]);

  const speak = (e) => {
    e.stopPropagation();

    // Use local audio files
    const audioPath = `${import.meta.env.BASE_URL}audio/${romaji}.mp3`;
    const audio = new Audio(audioPath);

    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
      // Fallback to synthesis if file missing
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleClick = () => {
    if (!flipped) {
      setFlipped(true);
      onReveal();
    }
  };

  // Calculate dynamic classes based on scale
  const containerSize = size === 'compact'
    ? (scale === 2 ? 'w-full aspect-[1/1]' : 'w-full aspect-[4/3] sm:aspect-[1/1]')
    : 'w-40 h-48';

  const charTextSize = size === 'compact'
    ? (scale === 2 ? 'text-4xl sm:text-5xl' : 'text-base sm:text-lg')
    : 'text-5xl';

  const romajiTextSize = size === 'compact'
    ? (scale === 2 ? 'text-lg sm:text-xl' : 'text-[9px] sm:text-[10px]')
    : 'text-xl';

  const speakBtnSize = size === 'compact'
    ? (scale === 2 ? 'text-4xl sm:text-5xl' : 'text-base sm:text-xl')
    : 'text-4xl';

  return (
    <div
      onClick={handleClick}
      className={`
        relative ${containerSize} cursor-pointer perspective-1000 transition-transform duration-300 transform active:scale-95
      `}
    >
      <div className={`
        w-full h-full duration-500 preserve-3d absolute
        ${flipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front (Character) */}
        <div className={`absolute backface-hidden w-full h-full bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center`}>
          <span className={`${charTextSize} font-bold bg-gradient-to-br from-indigo-600 to-cyan-600 bg-clip-text text-transparent`}>
            {char}
          </span>
        </div>

        {/* Back (Romaji) */}
        <div className={`absolute backface-hidden w-full h-full bg-slate-50 rounded-lg sm:rounded-xl border-2 border-indigo-100 shadow-sm flex flex-col items-center justify-center rotate-y-180`}>
          <button
            onClick={speak}
            className={`${speakBtnSize} font-bold text-slate-800 ${size === 'compact' ? 'mb-0' : 'mb-2'} hover:scale-110 active:scale-95 transition-transform cursor-pointer`}
            title="Click to pronounce"
          >
            {char}
          </button>
          <span className={`${romajiTextSize} font-medium text-indigo-400 flex items-center gap-1`}>
            {romaji}
            {origin && <span className="text-slate-300">({origin})</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
