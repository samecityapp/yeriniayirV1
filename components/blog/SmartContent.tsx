import React from 'react';
import Link from 'next/link';
import { INTERNAL_LINKS } from '@/lib/internal-links';
import { TableOfContents } from './TableOfContents';

type Props = {
    content: string;
    lang: 'tr' | 'en';
    imageMetadata?: Record<string, { alt_tr: string; alt_en: string }>;
};

// Helper function to slugify text for IDs (Updated with Turkish support)
const slugify = (text: string) => {
    const trMap: { [key: string]: string } = {
        'ş': 's', 'Ş': 's', 'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
    };

    return text
        .toString()
        .replace(/[şŞıİğĞüÜöÖçÇ]/g, match => trMap[match])
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export const SmartContent = ({ content, lang, imageMetadata }: Props) => {
    // Basic protection against empty content
    if (!content) return null;

    let processedContent = content;

    // --- 0. Image Alt Localization Logic ---
    if (imageMetadata) {
        Object.entries(imageMetadata).forEach(([url, alts]) => {
            const localizedAlt = lang === 'tr' ? alts.alt_tr : alts.alt_en;
            if (!localizedAlt) return;

            const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const imgTagRegex = new RegExp(`<img([^>]*?)src="${escapedUrl}"([^>]*?)>`, 'gi');

            processedContent = processedContent.replace(imgTagRegex, (match, beforeSrc, afterSrc) => {
                const fullTagAttrs = `${beforeSrc}src="${url}"${afterSrc}`;
                if (/alt="[^"]*"/.test(fullTagAttrs)) {
                    return `<img${fullTagAttrs.replace(/alt="[^"]*"/, `alt="${localizedAlt}"`)}>`;
                } else {
                    return `<img${fullTagAttrs} alt="${localizedAlt}">`;
                }
            });
        });
    }

    // --- 1. Internal Linking Logic ---
    // Strategy: Replace links with placeholders to prevent nesting, then restore them.
    const sortedLinks = [...(INTERNAL_LINKS[lang] || [])].sort((a, b) => b.keyword.length - a.keyword.length);
    const placeholders: string[] = [];
    const usedKeywords = new Set();

    sortedLinks.forEach(({ keyword, url }) => {
        if (usedKeywords.has(keyword)) return;

        // Escape keyword for regex
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Regex: (prefix)(textBefore)(keyword)(lookahead)
        const regex = new RegExp(`(>|^)([^<]*?)(${escapedKeyword})(?=$|\\s|[.,:;!?'"\\])]|<)`, 'i');

        if (regex.test(processedContent)) {
            // Replace ONLY the first occurrence (non-global regex)
            processedContent = processedContent.replace(regex, (fullMatch, prefix, textBefore, matchedKeyword) => {
                // JS Boundary Check for Pre-Boundary
                const precedingChar = textBefore.length > 0 ? textBefore.slice(-1) : (prefix === '>' ? '>' : '');

                // If preceding char is a word character (including Turkish), SKIP replacement (it's part of another word)
                if (precedingChar && /[a-zA-Z0-9_şŞıİğĞüÜöÖçÇ]/.test(precedingChar)) {
                    return fullMatch;
                }

                usedKeywords.add(keyword);
                const linkHtml = `<a href="${url}" class="text-primary font-semibold hover:underline">${matchedKeyword}</a>`;
                const placeholder = `:::LINK_${placeholders.length}:::`;
                placeholders.push(linkHtml);
                return `${prefix}${textBefore}${placeholder}`;
            });
        }
    });

    // Restore placeholders
    placeholders.forEach((html, index) => {
        processedContent = processedContent.replace(`:::LINK_${index}:::`, html);
    });

    // --- 2. Table of Contents Logic (H2 & H3) ---
    const tocItems: { id: string; text: string; level: number }[] = [];

    // Regex to find H2 and H3 tags
    // Captures: 1=Tag(h2|h3), 2=Attributes, 3=Content
    const headerRegex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;

    processedContent = processedContent.replace(headerRegex, (match, tag, attrs, innerText) => {
        // Strip HTML from innerText for the TOC title
        const plainText = innerText.replace(/<[^>]*>/g, '');
        const id = slugify(plainText);
        const level = parseInt(tag.charAt(1));

        tocItems.push({ id, text: plainText, level });

        let newAttrs = attrs;
        if (!attrs.includes('id=')) {
            newAttrs = `${attrs} id="${id}"`;
        }

        return `<${tag}${newAttrs}>${innerText}</${tag}>`;
    });

    return (
        <div className="max-w-none">
            {/* Render Table of Contents if we have items */}
            {tocItems.length > 0 && (
                <TableOfContents items={tocItems} lang={lang} />
            )}

            <div
                className="prose prose-base md:prose-lg lg:prose-xl prose-zinc dark:prose-invert
                    mx-auto
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 
                    prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                    prose-p:text-zinc-700 prose-p:leading-loose prose-p:mb-8 prose-p:font-normal
                    prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                    prose-strong:text-zinc-900 prose-strong:font-bold
                    prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-12 prose-img:w-full
                    prose-blockquote:border-l-4 prose-blockquote:border-foreground/80 prose-blockquote:bg-zinc-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:my-10
                    prose-ul:my-8 prose-li:my-3 prose-li:text-zinc-700 prose-li:leading-loose"
                dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        </div>
    );
};
