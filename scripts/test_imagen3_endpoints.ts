async function testImagen3() {
    const apiKey = 'AIzaSyCVEAM5S-_4kUEp9Cetof5CEn-rSXOfRC4';

    // Test imagen-3.0-generate-002
    const url002 = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    console.log("Testing imagen-3.0-generate-002...");
    try {
        const resp002 = await fetch(url002, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "instances": [{ "prompt": "Beautiful sunset over Fethiye marina, hyper realistic photography" }],
                "parameters": { "sampleCount": 1 }
            })
        });
        const data002 = await resp002.json();
        if (data002.error) {
            console.log("imagen-3.0-generate-002 ❌:", data002.error.message);
        } else {
            console.log("imagen-3.0-generate-002 ✅ SUCCESS! Has predictions:", !!data002.predictions);
        }
    } catch (e) {
        console.log("Error:", e);
    }

    // Test imagen-3.0-generate-001
    const url001 = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
    console.log("\nTesting imagen-3.0-generate-001...");
    try {
        const resp001 = await fetch(url001, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "instances": [{ "prompt": "Beautiful sunset over Fethiye marina, hyper realistic photography" }],
                "parameters": { "sampleCount": 1 }
            })
        });
        const data001 = await resp001.json();
        if (data001.error) {
            console.log("imagen-3.0-generate-001 ❌:", data001.error.message);
        } else {
            console.log("imagen-3.0-generate-001 ✅ SUCCESS! Has predictions:", !!data001.predictions);
        }
    } catch (e) {
        console.log("Error:", e);
    }
}
testImagen3();
