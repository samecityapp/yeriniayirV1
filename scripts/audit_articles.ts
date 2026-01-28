import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Regex Patterns for Corruption
const PATTERNS = {
    ESCAPED_NEWLINE: /\\n/g,
    LEAKED_JSON_START: /^{"/,
    LEAKED_JSON_BRACE: /^{/,
    UNWANTED_PATH_PREFIX: /(\/en\/|\/tr\/)/g,
    PROMPT_LEAKAGE: /(hyper-realistic|do not pose|camera settings|f\/8|iso \d+|high quality photo|photorealistic|prompt:)/i,
    PLACEHOLDER_LEAKAGE: /<!-- IMAGE_|\[Image|IMAGE_PLACEHOLDER/i,
    MARKDOWN_JSON_BLOCK: /```json/i
};

async function audit() {
    console.log("🔍 Starting Article Content Audit (Improved)...");

    // Fetch all articles
    const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, title, content');

    if (error) {
        console.error("❌ Database Error:", error);
        return;
    }

    console.log(`📚 Found ${articles.length} articles. Scanning...\n`);

    const corrupted: any[] = [];
    const stats = {
        total: articles.length,
        clean: 0,
        corrupted: 0,
        issues: {
            escaped_newline: 0,
            leaked_json: 0,
            path_prefix: 0,
            prompt_leak: 0,
            placeholder: 0,
            markdown_block: 0,
            double_encoded_but_valid: 0
        }
    };

    for (const article of articles) {
        let issues: string[] = [];
        let contentStr = "";

        // Normalize content
        if (typeof article.content === 'object' && article.content !== null) {
            // Check specific languages if it's JSON
            const en = article.content.en || "";
            const tr = article.content.tr || "";
            contentStr = en + " " + tr;
        } else if (typeof article.content === 'string') {
            // Try Parsing
            try {
                const parsed = JSON.parse(article.content);
                if (parsed.en || parsed.tr) {
                    // It's valid JSON stored as text. This is Acceptable.
                    stats.issues.double_encoded_but_valid++;
                    contentStr = (parsed.en || "") + " " + (parsed.tr || "");
                    // Do NOT flag as DOUBLE_ENCODED_JSON if it's valid
                } else {
                    // It's JSON, but not in the expected {en: ..., tr: ...} format
                    contentStr = article.content; // Keep original for other checks
                    if (PATTERNS.LEAKED_JSON_START.test(contentStr)) {
                        issues.push("DOUBLE_ENCODED_JSON (Invalid Schema)");
                        stats.issues.leaked_json++;
                    }
                }
            } catch (e) {
                // Raw string that is not JSON
                contentStr = article.content;
            }
        }

        // 1. Check Escaped Newlines
        if (PATTERNS.ESCAPED_NEWLINE.test(contentStr)) {
            issues.push("ESCAPED_NEWLINE (\\n)");
            stats.issues.escaped_newline++;
        }

        // 2. Check Unwanted Path Prefixes
        if (PATTERNS.UNWANTED_PATH_PREFIX.test(contentStr)) {
            // Filter out valid links that might intentionally link to /en/ ? 
            // Usually we want relative links /guide/... not /en/guide/... if we are doing dynamic routing?
            // Actually, internal links often shouldn't have hardcoded locales if we use [lang].
            // But let's flag it for review.
            issues.push("HARDCODED_LOCALE_PATH (/en/ or /tr/)");
            stats.issues.path_prefix++;
        }

        // 3. Prompt Leakage
        if (PATTERNS.PROMPT_LEAKAGE.test(contentStr)) {
            // Be careful not to flag "4k video" if valid. But "do not pose" is definitely a prompt.
            // Let's rely on specific key phrases.
            issues.push("POSSIBLE_PROMPT_LEAKAGE");
            stats.issues.prompt_leak++;
        }

        // 4. Placeholders
        if (PATTERNS.PLACEHOLDER_LEAKAGE.test(contentStr)) {
            issues.push("UNREPLACED_PLACEHOLDER");
            stats.issues.placeholder++;
        }

        // 5. Markdown Blocks
        if (PATTERNS.MARKDOWN_JSON_BLOCK.test(contentStr)) {
            issues.push("MARKDOWN_JSON_BLOCK");
            stats.issues.markdown_block++;
        }

        // 6. JSON Objects in Text (Leaked artifacts)
        // If content contains `{"` appearing in the middle of text, it's suspicious.
        // Or `}` at the end of a paragraph.
        if (contentStr.includes('{"') || contentStr.includes('"}')) {
            issues.push("SUSPICIOUS_JSON_FRAGMENT");
            stats.issues.leaked_json++;
        }

        if (issues.length > 0) {
            corrupted.push({
                slug: article.slug,
                title: typeof article.title === 'object' ? article.title.en : article.title,
                issues
            });
            stats.corrupted++;
        } else {
            stats.clean++;
        }
    }

    // Report
    console.log("---------------------------------------------------");
    console.log(`📊 AUDIT REPORT`);
    console.log("---------------------------------------------------");
    console.log(`Total Articles: ${stats.total}`);
    console.log(`✅ Clean: ${stats.clean}`);
    console.log(`❌ Corrupted: ${stats.corrupted}`);
    console.log("\nIssue Breakdown:");
    console.log(stats.issues);
    console.log("---------------------------------------------------");

    if (corrupted.length > 0) {
        console.log("\n⚠️ DETAILED LIST OF CORRUPTED ARTICLES:");
        corrupted.forEach(a => {
            console.log(`\n• [${a.slug}]`);
            console.log(`  Issues: ${a.issues.join(", ")}`);
        });

        // Write to file for record
        fs.writeFileSync('audit_report.json', JSON.stringify(corrupted, null, 2));
        console.log("\n📄 Detailed report saved to 'audit_report.json'");
    } else {
        console.log("\n🎉 AMAZING! No corruption found.");
    }
}

audit();
