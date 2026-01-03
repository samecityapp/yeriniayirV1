import React from 'react';
import { getLocalizedText } from '@/lib/localization';

type TOCItem = {
    id: string;
    text: string;
    level: number; // 2 for H2, 3 for H3
};

type Props = {
    items: TOCItem[];
    lang: 'tr' | 'en';
};

export const TableOfContents = ({ items, lang }: Props) => {
    if (items.length === 0) return null;

    const title = lang === 'tr' ? 'İçindekiler' : 'Table of Contents';

    return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-8 not-prose">
            <h4 className="text-lg font-bold text-zinc-900 mb-4">{title}</h4>
            <nav>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={`${item.level === 3 ? 'ml-4' : ''}`}
                        >
                            <a
                                href={`#${item.id}`}
                                className="text-zinc-600 hover:text-primary transition-colors text-sm font-medium block py-1"
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};
