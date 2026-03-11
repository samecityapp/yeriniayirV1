import fs from 'fs';
import path from 'path';

const draftsDir = path.resolve(process.cwd(), 'data/drafts');
const files = fs.readdirSync(draftsDir).filter(f => f.startsWith('istanbul_') && f.endsWith('.html'));

files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)![0]);
    const numB = parseInt(b.match(/\d+/)![0]);
    return numA - numB;
});

for (const file of files) {
    const content = fs.readFileSync(path.join(draftsDir, file), 'utf-8');
    // Extract first h2
    const h2Match = content.match(/<h2>(.*?)<\/h2>/);
    const title = h2Match ? h2Match[1] : 'No title';
    
    // Count words (strip tags)
    const textOnly = content.replace(/<[^>]*>?/gm, ' ');
    const wordCount = textOnly.trim().split(/\s+/).length;
    
    console.log(`${file}: ${wordCount} words - "${title}"`);
}
