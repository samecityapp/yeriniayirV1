import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4' });

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
