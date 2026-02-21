import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4' });

async function checkModels() {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: 'Hyper-realistic wide angle photography of a beautiful sunny beach in Fethiye Turkey, crystal clear turquoise water, pebbles, no people, cinematic lighting, 8k resolution, highly detailed',
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
            }
        });

        console.log(response);

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            const buffer = Buffer.from(base64Image, 'base64');
            const outputPath = path.resolve(__dirname, '../public/images/test_imagen_3_ts.jpg');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Success! Image generated and saved to: ${outputPath}`);
        }
    } catch (e: any) {
        console.error("Failed", e.message || e);
    }
}
checkModels();
