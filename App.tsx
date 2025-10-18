
import React, { useState, useCallback, useRef } from 'react';
import { generateSpeech } from './services/geminiService';
import { bufferToWav } from './services/audioService';
import Spinner from './components/Spinner';
import InfoPanel from './components/InfoPanel';
import { RobotIcon } from './components/icons/RobotIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [text, setText] = useState<string>('Hello! I am an AI voice generated using the Gemini API. You can type any text here to hear how I sound.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate audio.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const audioBuffer = await generateSpeech(text);
      const wavBlob = bufferToWav(audioBuffer);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      
      // Auto-play the audio once it's ready
      if(audioRef.current) {
         audioRef.current.src = url;
         audioRef.current.load();
         audioRef.current.play().catch(e => console.error("Autoplay was prevented.", e));
      }
      
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate audio. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <RobotIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI Voice Generator
            </h1>
          </div>
          <p className="mt-2 text-lg text-slate-400">
            Convert text to speech with a realistic AI voice powered by Gemini.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-cyan-500/10 border border-slate-700 p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-2">
                Enter your text
              </label>
              <textarea
                id="text-input"
                rows={5}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-slate-500 resize-none"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate Voice
                </>
              )}
            </button>
            
            {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-3 rounded-lg border border-red-700">{error}</p>}

            {audioUrl && (
              <div className="mt-4 animate-fade-in">
                <p className="text-sm font-medium text-slate-300 mb-2 text-center">Generated Audio</p>
                <audio ref={audioRef} controls src={audioUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </main>
        
        <InfoPanel />

        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Built with React, TailwindCSS, and the Google Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
