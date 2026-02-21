import fs from 'fs';
import path from 'path';

async function testFetch() {
    console.log("Starting test fetch...");
    const apiKey = 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "instances": [{ "prompt": "Hyper realistic professional photo of Ölüdeniz beach in Fethiye Turkey, sunny, turquoise water, 8k" }],
                "parameters": { "sampleCount": 1 }
            })
        });

        const text = await response.text();
        console.log("Raw Response:");
        console.log(text.substring(0, 1000));
    } catch (e: any) {
        console.error("failed:", e);
    }
}
testFetch().then(() => console.log("Done."));
