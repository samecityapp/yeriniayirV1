import React from 'react';
import Image from 'next/image';

export function BrandLogo({ className = "w-8 h-8" }: { className?: string; color?: string }) {
    // className is typically something like "w-8 h-8", but for Image we often want relative sizing or fixed dimensions.
    // Since we are replacing an SVG, we will wrap the Image in a div that accepts the className to control size.

    return (
        <svg
            width="800"
            height="250"
            viewBox="0 0 800 250"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <style>
                    {`
                        .brand-text { font-family: 'Arial', 'Helvetica', sans-serif; font-weight: bold; fill: #1a1e21; }
                        .brand-icon-red { fill: #ef4444; }
                        .brand-icon-white { fill: #ffffff; }
                    `}
                </style>
            </defs>

            <g transform="translate(190, 30)">
                <rect x="0" y="15" width="60" height="65" rx="2" className="brand-icon-red" />
                <rect x="8" y="25" width="18" height="18" rx="1" className="brand-icon-white" />
                <rect x="34" y="25" width="18" height="18" rx="1" className="brand-icon-white" />
                <rect x="8" y="50" width="18" height="18" rx="1" className="brand-icon-white" />
                <rect x="34" y="50" width="18" height="18" rx="1" className="brand-icon-white" />
                <rect x="22" y="55" width="16" height="25" className="brand-icon-white" />
            </g>

            <g transform="translate(300, 45)">
                <path d="M10,40 Q10,10 40,10 Q70,10 70,40" fill="#ef4444" />
                <rect x="5" y="40" width="70" height="10" rx="2" className="brand-icon-red" />
                <circle cx="40" cy="8" r="5" className="brand-icon-red" />
                <path d="M-5,15 Q-15,25 -5,35" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M85,15 Q95,25 85,35" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            </g>

            <g transform="translate(490, 30)">
                <path d="M15,0 L35,0 A15,15 0 0 1 50,15 L50,70 A5,5 0 0 1 45,75 L5,75 A5,5 0 0 1 0,70 L0,15 A15,15 0 0 1 15,0" className="brand-icon-red" />
                <circle cx="25" cy="20" r="10" fill="white" />
                <text x="25" y="45" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">DND</text>
                <path d="M15,55 L35,65 M35,55 L15,65" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>

            <text x="50%" y="180" fontSize="110" textAnchor="middle" className="brand-text" letterSpacing="-2">
                YeriniAyır.com
            </text>
        </svg>
    );
}
