import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
    className?: string;
    lang?: string;
}

export function BrandLogo({ className, lang = 'tr' }: BrandLogoProps) {
    if (lang === 'en') {
        // Remove sizing classes to allow text to define its own dimensions and center properly
        const textClassName = className?.replace(/h-\d+|w-auto|aspect-\[.*?\]/g, '').trim() || '';

        return (
            <div className={`flex items-baseline font-bold tracking-tight leading-none overflow-visible whitespace-nowrap ${textClassName}`}>
                <span className="text-lg md:text-xl text-gray-900">Worldand</span>
                <span className="text-lg md:text-xl text-[#FF385C]">Hotels</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium ml-px">.com</span>
            </div>
        );
    }

    return (
        <div className={className}>
            <Image
                src="/images/yeriniayir-logo.png"
                alt="Yerini Ayır"
                width={800}
                height={250}
                className="w-full h-full object-contain"
                priority
            />
        </div>
    );
}
