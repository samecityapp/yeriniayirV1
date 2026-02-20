
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verify() {
    console.log("🔍 Checking Google Auth...");

    try {
        // Try without keyFile to use ADC
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
        });

        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const accessToken = await client.getAccessToken();

        console.log(`✅ Auth Successful!`);
        console.log(`   Project ID: ${projectId}`);
        console.log(`   Token available: ${!!accessToken.token}`);

    } catch (error) {
        console.error("❌ Auth Failed:", error);
    }
}

verify();
