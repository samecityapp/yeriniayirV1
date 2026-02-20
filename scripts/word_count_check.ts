
import fs from 'fs';

function countWords(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Extract the content string (roughly)
    const match = content.match(/content:\s*`([\s\S]*?)`/);
    if (!match) {
        console.log(`Could not find content in ${filePath}`);
        return 0;
    }
    const htmlContent = match[1];
    // Strip HTML tags
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
    // Count words
    const words = textContent.trim().split(/\s+/);
    return words.length;
}

const count1 = countWords('scripts/add_article_01_boarding.ts');
const count2 = countWords('scripts/add_article_02_ultra.ts');

console.log(`Article 1 Word Count: ${count1}`);
console.log(`Article 2 Word Count: ${count2}`);
