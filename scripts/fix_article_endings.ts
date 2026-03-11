import { VertexAI } from '@google-cloud/vertexai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = 'us-central1';
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), 'google-credentials.json');
const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(prompt: string, modelStr: string = 'gemini-2.5-pro'): Promise<string> {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelStr,
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
    });
    for (let i = 0; i < 5; i++) {
        try {
            const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
            const resp = await generativeModel.generateContent(req);
            const contentResponse = await resp.response;
            if (contentResponse.candidates && contentResponse.candidates[0].content.parts[0].text) {
                return contentResponse.candidates[0].content.parts[0].text;
            }
            return '';
        } catch (e: any) {
            console.error(`Error generating content (${i + 1}/5):`, e.message);
            await sleep(15000 * (i + 1));
        }
    }
    throw new Error("Failed to generate content after 5 retries");
}

function cleanHtml(html: string): string {
    let clean = html.replace(/```html/gi, '').replace(/```/g, '').replace(/\/en/g, '').replace(/Ttr/g, '');
    return clean.trim();
}

async function fixArticleEndings() {
    console.log("Fetching exact 13 Istanbul articles to fix endings...\n");
    const targetSlugs = [
        'i-stanbul-havalimani-ist-transfer-secimi-taksi-mi-metro-mu-ozel-transfer-mi-gece-varisi-plani',
        'sabiha-gokcen-den-sehre-en-kolay-ulasim-secenekler-ve-hangi-saatte-hangisi-mantikli',
        'i-stanbul-da-1-gunde-2-kita-avrupa-anadolu-rotasi-saat-saat-yurume-seviyesi',
        'i-stanbul-da-gun-batimi-noktalari-kalabaliksiz-saatler-en-i-yi-sunset-walk-rotalari',
        'i-stanbul-da-yagmurlu-gun-plani-kapali-mek-n-rotalari-muze-carsi-kafe-akisi',
        'i-stanbul-da-aksam-ne-yapilir-rehberi-aile-cift-tek-kisi-i-cin-guvenli-ve-keyifli-plan',
        'i-stanbul-da-dolandirilmadan-degil-surpriz-yasamadan-gezmek-basit-kurallar-taksi-menu-tur',
        'i-stanbul-da-camii-ziyareti-rehberi-giyim-saat-fotograf-kurallari-turist-i-cin-basit-anlatim',
        'i-stanbul-da-yuruyerek-gezilecek-semtler-2-3-saatlik-mini-rotalar-harita-mantigiyla',
        'i-stanbul-da-cocukla-gezi-bebek-cocuk-checklists-ogle-sicagi-yagmur-plani',
        'i-stanbul-butce-planlayici-ekonomik-dengeli-rahat-mod-fiyat-vermeden-harcama-mantigi',
        'i-stanbul-da-en-i-yi-fotograf-i-cerik-rotasi-1-gunde-viral-kareler-isik-saatleri-kalabalik-stratejisi',
        'i-stanbul-da-ulasim-rehberi-i-stanbulkart-metro-tramvay-feribot-mantigi-kafasi-karisanlara'
    ];

    const { data: finalArticles } = await supabase.from('articles').select('slug, content, title').in('slug', targetSlugs);
    if (!finalArticles || finalArticles.length === 0) return console.log("No articles found.");

    for (const article of finalArticles) {
        let trContent = '';
        if (typeof article.content === 'string') {
            try { trContent = JSON.parse(article.content).tr; } catch (e) { trContent = article.content; }
        } else { trContent = article.content?.tr || ''; }

        let originalLength = trContent.length;

        // 1. Remove existing broken/incomplete FAQ sections to regenerate reliably
        const lowerTr = trContent.toLowerCase();
        let faqIdx = lowerTr.indexOf('sıkça sorulan');
        if (faqIdx === -1) faqIdx = lowerTr.indexOf('sorulan sorular');
        if (faqIdx === -1) faqIdx = lowerTr.indexOf('faq');

        if (faqIdx !== -1) {
            let cutIdx = lowerTr.lastIndexOf('<h2', faqIdx);
            if (cutIdx === -1) cutIdx = lowerTr.lastIndexOf('<h3', faqIdx);
            if (cutIdx !== -1) {
                trContent = trContent.substring(0, cutIdx);
                console.log(`[${article.slug}] Found existing incomplete FAQ, pruning it for recreation.`);
            }
        }

        // 2. Safe Cutoff to guarantee well-formed HTML before appending
        const matchArr = [...trContent.matchAll(/(<\/p>|<\/ul>|<\/ol>|<\/div>|<\/h[1-6]>)/gi)];
        if (matchArr.length > 0) {
            const lastMatch = matchArr[matchArr.length - 1];
            const endIdx = lastMatch.index + lastMatch[0].length;
            trContent = trContent.substring(0, endIdx);
        }

        const contextStr = trContent.slice(-1600);

        console.log(`\n⏳ Generating Conclusion & FAQ for: ${article.title}`);
        const prompt = `
You are an expert travel blog writer for 'yeriniayir.com'. 
We are writing an extremely detailed Turkish travel article about Istanbul titled "${article.title}".
The article is almost completely written, but it needs a conclusion and a FAQ section.

Here are the LAST 1500 characters of the CURRENT article so you know exactly where we are:
=== CONTEXT START ===
${contextStr}
=== CONTEXT END ===

YOUR TASK:
Write the REMAINING part of the article to append beautifully right after the context.
1. DO NOT invent a new title or repeat the text above. Write EXACTLY the text to append.
2. Start with a concluding paragraph summarizing the overall article (use <h2>Sonuç</h2> or a creative closing heading if appropriate).
3. MUST add a "Sıkça Sorulan Sorular (F.A.Q.)" section with exactly 5 relevant questions and answers. Format it flawlessly: use <h2>Sıkça Sorulan Sorular</h2>, questions in <h3>, and answers in <p class="text-lg text-gray-700 leading-relaxed mb-6">.
4. Return ONLY the raw HTML ready to be appended. Do NOT wrap in \`\`\`html.
5. Provide the output in strictly natural and native Turkish language.
`;

        const generatedHtmlRaw = await generateWithRetry(prompt, 'gemini-2.5-pro');
        const appendHtml = cleanHtml(generatedHtmlRaw);

        const finalTrContent = trContent + "\n\n" + appendHtml;

        let newContent = article.content;
        if (typeof newContent === 'string') {
            newContent = { tr: finalTrContent, en: "<p>English version coming soon.</p>" };
        } else {
            newContent.tr = finalTrContent;
        }

        await supabase.from('articles').update({ content: newContent }).eq('slug', article.slug);
        console.log(`✅ Success for ${article.slug}. Added ${appendHtml.length} chars (FAQ + End).`);
        await sleep(3000);
    }

    console.log("🎉 ALL ARTICLES FIXED!");
}

fixArticleEndings();
