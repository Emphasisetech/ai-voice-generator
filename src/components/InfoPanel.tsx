
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const InfoPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-8 bg-slate-800/50 rounded-lg border border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left text-slate-200 hover:bg-slate-700/50"
            >
                <h3 className="font-semibold">Developer Notes & How-To</h3>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-6 border-t border-slate-700 text-slate-400 space-y-6 text-sm">
                    <section>
                        <h4 className="font-semibold text-white mb-2">1. Gemini API Key Setup</h4>
                        <p>This application requires a Google Gemini API key. It's configured to read the key from an environment variable named <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">API_KEY</code>.</p>
                        <p className="mt-2">To run this locally, create a <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">.env</code> file in the project root and add your key: <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">API_KEY=your_api_key_here</code>. The build setup will handle the rest.</p>
                        <p className="mt-2"><strong>Important:</strong> This is a client-side application. For a production environment, it is highly recommended to route API calls through a backend proxy server to protect your API key.</p>
                    </section>
                    
                    <section>
                        <h4 className="font-semibold text-white mb-2">2. Voice Cloning and Custom Voices</h4>
                        <p>The free tier of the Gemini API used here does not support voice cloning from your own audio samples. It provides a set of high-quality, pre-built voices.</p>
                        <p className="mt-2">You can change the voice by editing the <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">geminiService.ts</code> file. Look for the <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">selectedVoice</code> variable and change its value to another pre-built voice name (e.g., 'Puck', 'Charon').</p>
                        <p className="mt-2">True voice cloning is an advanced feature available in services like Google Cloud's <a href="https://cloud.google.com/text-to-speech/docs/custom-voice-overview" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Custom Voice</a>, which is a paid, enterprise-grade product.</p>
                    </section>

                    <section>
                        <h4 className="font-semibold text-white mb-2">3. Backend Architecture</h4>
                        <p>This demo is a pure frontend application built with React. It calls the Gemini API directly from the browser for simplicity. There is no separate Node.js/Express backend, as it's not strictly necessary for this functionality and simplifies deployment.</p>
                    </section>

                    <section>
                        <h4 className="font-semibold text-white mb-2">4. Free Deployment</h4>
                        <p>You can deploy this site for free on platforms like Vercel, Netlify, or GitHub Pages.</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Vercel/Netlify:</strong> Connect your Git repository (GitHub, GitLab, etc.). The platform will automatically detect it's a React project. Add your Gemini API key as an environment variable in the project settings on the platform's dashboard.</li>
                            <li><strong>GitHub Pages:</strong> You will need to configure your build process to output to a <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">docs</code> folder or use GitHub Actions for deployment. Managing API keys securely is more complex on GitHub Pages; Vercel is recommended for ease of use.</li>
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
};

export default InfoPanel;
