import React from 'react';
import Image from 'next/image';

export function BrandLogo({ className = "w-8 h-8" }: { className?: string; color?: string }) {
    // className is typically something like "w-8 h-8", but for Image we often want relative sizing or fixed dimensions.
    // Since we are replacing an SVG, we will wrap the Image in a div that accepts the className to control size.

    return (
        <div className={`relative ${className}`}>
            <Image
                src="/logo.png"
                alt="YeriniAyır Logo"
                fill
                className="object-contain" // Ensures the logo fits within the dimensions without distortion
                priority // Load this image with high priority as it is LCP candidate
            />
        </div>
    );
}
