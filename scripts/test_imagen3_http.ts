if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required; no request sent.');
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkModels() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: 'Say hello world'
        });
        
        console.log("Success with Flash:", response.text);

    } catch (e: any) {
        console.error("Failed", e.message || e);
    }
}
checkModels();
