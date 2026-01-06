import { useState, useMemo, Fragment } from 'react';
import Card from './components/Card';
import { HIRAGANA, KATAKANA } from './data/kana';

function App() {
  const [syllabary, setSyllabary] = useState('hiragana'); // 'hiragana', 'katakana'
  const [view, setView] = useState('grid'); // 'grid', 'quiz'
  const [quizIndex, setQuizIndex] = useState(0);
  const [isQuizRevealed, setIsQuizRevealed] = useState(false);
  const [shuffledData, setShuffledData] = useState([]);

  const data = syllabary === 'hiragana' ? HIRAGANA : KATAKANA;

  // Initialize quiz data
  useMemo(() => {
    setShuffledData([...data].filter(item => item !== null).sort(() => Math.random() - 0.5));
    setQuizIndex(0);
    setIsQuizRevealed(false);
  }, [data, view]);

  const handleNextQuiz = () => {
    setIsQuizRevealed(false);
    setQuizIndex((prev) => (prev + 1) % shuffledData.length);
  };

  const handlePrevQuiz = () => {
    setIsQuizRevealed(false);
    setQuizIndex((prev) => (prev - 1 + shuffledData.length) % shuffledData.length);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center py-10 px-4">
      <header className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            Kana Memory
          </h1>
          <p className="text-slate-600 mt-2">Master the Japanese Syllabary</p>
        </div>

        <div className="flex gap-4 bg-white/50 p-2 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setSyllabary('hiragana')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${syllabary === 'hiragana'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setSyllabary('katakana')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${syllabary === 'katakana'
              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
          >
            Katakana
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-white/50 p-1 rounded-xl backdrop-blur-sm border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'grid' ? 'bg-indigo-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setView('quiz')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'quiz' ? 'bg-indigo-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Quiz Mode
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-[auto_repeat(5,_minmax(0,_1fr))] gap-x-1 gap-y-2 sm:gap-x-2 sm:gap-y-4 justify-items-center max-w-lg mx-auto transform scale-90 sm:scale-100 origin-top">
            {/* Column Headers */}
            <div className="p-2"></div>
            {['a', 'i', 'u', 'e', 'o'].map(col => (
              <div key={col} className="flex items-center justify-center font-bold text-slate-400 capitalize pb-2">
                {col}
              </div>
            ))}

            {/* Rows */}
            {['-', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'n'].map((rowLabel, rowIndex) => {
              // Render Row Header and 5 cells
              const rowItems = data.slice(rowIndex * 5, (rowIndex + 1) * 5);
              return (
                <Fragment key={rowLabel}>
                  <div className="flex items-center justify-center font-bold text-slate-400 capitalize pr-2">
                    {rowLabel === '-' ? '' : rowLabel}
                  </div>
                  {rowItems.map((item, colIndex) => (
                    item ? (
                      <div key={`${item.char}-${colIndex}`} className="w-full aspect-[3/4]">
                        <Card
                          char={item.char}
                          romaji={item.romaji}
                          isRevealed={true}
                          onReveal={() => { }}
                          size="compact"
                        />
                      </div>
                    ) : (
                      <div key={`empty-${rowIndex}-${colIndex}`} className="w-full" />
                    )
                  ))}
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-8 scale-150 transform transition-transform duration-500">
              {shuffledData.length > 0 && (
                <Card
                  key={shuffledData[quizIndex].char}
                  char={shuffledData[quizIndex].char}
                  romaji={shuffledData[quizIndex].romaji}
                  isRevealed={isQuizRevealed}
                  onReveal={() => setIsQuizRevealed(true)}
                  size="normal"
                />
              )}
            </div>

            <div className="flex gap-4 items-center mt-8">
              <button
                onClick={handleNextQuiz}
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all"
              >
                Next Card
              </button>
            </div>
            <p className="mt-8 text-slate-400 text-sm">Click card to reveal answer</p>
          </div>
        )}

      </main >
    </div >
  );
}

export default App;
