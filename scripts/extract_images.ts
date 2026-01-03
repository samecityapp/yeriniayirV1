
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load envs
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractImages() {
    console.log("Fetching articles...");
    const { data: articles, error } = await supabase
        .from("articles")
        .select("slug, title, content");

    if (error) {
        console.error("Error fetching articles:", error);
        process.exit(1);
    }

    const images: any[] = [];
    const urlSet = new Set();

    articles.forEach((article: any) => {
        const content = article.content || "";
        // Regex for img tags
        const imgRegex = /<img[^>]+src="([^">]+)"([^>]*)/g;
        let match;

        while ((match = imgRegex.exec(content)) !== null) {
            const src = match[1];
            const rest = match[2];
            const altMatch = /alt="([^"]*)"/.exec(rest);
            const currentAlt = altMatch ? altMatch[1] : "";

            if (!urlSet.has(src)) {
                urlSet.add(src);
                images.push({
                    url: src,
                    currentAlt: currentAlt,
                    articleTitle: article.title,
                    articleSlug: article.slug
                });
            }
        }
    });

    console.log(`Found ${images.length} unique images.`);
    fs.writeFileSync(path.join(process.cwd(), "images_to_process.json"), JSON.stringify(images, null, 2));
}

extractImages();
