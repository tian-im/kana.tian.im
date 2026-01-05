import { useState, useMemo } from 'react';
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
    setShuffledData([...data].sort(() => Math.random() - 0.5));
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      <header className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            Kana Memory
          </h1>
          <p className="text-slate-400 mt-2">Master the Japanese Syllabary</p>
        </div>

        <div className="flex gap-4 bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-700">
          <button
            onClick={() => setSyllabary('hiragana')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${syllabary === 'hiragana'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setSyllabary('katakana')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${syllabary === 'katakana'
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
          >
            Katakana
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-slate-700/50">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setView('quiz')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'quiz' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              Quiz Mode
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 justify-items-center">
            {data.map((item, index) => (
              <Card
                key={`${item.char}-${index}`}
                char={item.char}
                romaji={item.romaji}
                isRevealed={false}
                onReveal={() => { }}
              />
            ))}
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
                />
              )}
            </div>

            <div className="flex gap-4 items-center mt-8">
              <button
                onClick={handlePrevQuiz}
                className="p-3 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="text-slate-500 font-mono">
                {quizIndex + 1} / {shuffledData.length}
              </div>
              <button
                onClick={handleNextQuiz}
                className="p-3 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
            <p className="mt-4 text-slate-500 text-sm">Click card to reveal answer</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
