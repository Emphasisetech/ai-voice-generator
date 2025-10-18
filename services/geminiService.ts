
import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData } from './audioService';

// IMPORTANT: Do not expose your API key in client-side code.
// Use an environment variable and a backend proxy in production.
// For development and deployment on platforms like Vercel, you can use environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set. Please add it to your .env file or deployment configuration.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates speech from text using the EmphasiseTech API.
 * 
 * @param text The text to convert to speech.
 * @returns An AudioBuffer containing the generated speech.
 */
export async function generateSpeech(text: string): Promise<AudioBuffer> {
  const model = "gemini-2.5-flash-preview-tts";

  // --- Voice Selection ---
  // The Gemini TTS model offers several pre-built voices.
  // You can change the 'voiceName' to try different ones.
  // Available voices include: 'Kore', 'Puck', 'Charon', 'Zephyr', 'Fenrir'.
  // We'll use 'Kore' for this demo.
  const selectedVoice = 'Kore';

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Say with a clear and friendly tone: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: selectedVoice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("API did not return audio data.");
  }

  // The API returns raw PCM audio data, which needs to be decoded.
  // The sample rate for Gemini TTS is 24000 Hz.
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const decodedBytes = decode(base64Audio);
  const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
  
  return audioBuffer;
}
