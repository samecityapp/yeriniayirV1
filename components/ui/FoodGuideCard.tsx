import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Montserrat } from 'next/font/google';

// Fontu bileşen seviyesinde yükle (Veya layout'tan al)
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['600', '700'],
    display: 'swap',
});

interface FoodGuideCardProps {
    locationName?: string; // Örn: "Bodrum"
    slug?: string;
}

export default function FoodGuideCard({ locationName = "Bodrum" }: FoodGuideCardProps) {
    return (
        <div className={`group relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-[#0F2B4C] to-[#1E4D8C] flex flex-col items-center justify-center text-center p-3 ${montserrat.className}`}>

            {/* Dekoratif Arka Plan Efekti */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none group-hover:bg-white/10 transition-colors" />

            {/* İkon */}
            <div className="mb-1 p-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-sm ring-1 ring-white/10">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>

            {/* Metin */}
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight px-1">
                {locationName}
                <br />
                <span className="text-blue-100/90 text-[0.9em]">Ne Yenir?</span>
            </h3>

            {/* Alt Çizgi */}
            <div className="mt-2 w-6 h-0.5 bg-white/30 rounded-full group-hover:w-12 group-hover:bg-white transition-all duration-300" />

        </div>
    );
}
