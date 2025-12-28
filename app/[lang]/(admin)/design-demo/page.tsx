'use client';

import { useState } from 'react';

export default function DesignDemo() {
  const [selectedDesign, setSelectedDesign] = useState(1);

  const hotelName = "Hillside Beach Club";
  const locationCity = "Fethiye";
  const rating = 5;
  const price = 6700;

  const designs = [
    {
      id: 1,
      name: "Classic Border Cards",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: "Shadow Cards",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: "Gradient Background",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      name: "Rounded Thick Border",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-[3px] border-gray-800 rounded-full p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1">Konum</p>
            <p className="text-base font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-[3px] border-gray-800 rounded-full p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1">Yerini Ayır Skor</p>
            <p className="text-base font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-[3px] border-gray-800 rounded-full p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1">Fiyat</p>
            <p className="text-base font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      name: "Dark Mode",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-400 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-white">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-400 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-white">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-400 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-white">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      name: "Bottom Border Only",
      component: (
        <div className="flex items-center justify-center gap-6">
          <div className="flex-1 border-b-4 border-gray-900 pb-3 text-center">
            <p className="text-xs font-medium text-gray-600 mb-2">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-b-4 border-gray-900 pb-3 text-center">
            <p className="text-xs font-medium text-gray-600 mb-2">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-b-4 border-gray-900 pb-3 text-center">
            <p className="text-xs font-medium text-gray-600 mb-2">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      name: "Outlined with Shadow",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-2 border-gray-300 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-shadow">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-2 border-gray-300 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-shadow">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-2 border-gray-300 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-shadow">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      name: "Bold Squares",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-3xl p-5 text-center border-2 border-gray-200">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Konum</p>
            <p className="text-xl font-black text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-3xl p-5 text-center border-2 border-gray-200">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Yerini Ayır Skor</p>
            <p className="text-xl font-black text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-3xl p-5 text-center border-2 border-gray-200">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Fiyat</p>
            <p className="text-xl font-black text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      name: "Dotted Border",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-2 border-dashed border-gray-400 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-400 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-400 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      name: "Inner Shadow Premium",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-inner">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-inner">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-inner">
            <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      name: "Badge Style",
      component: (
        <div className="flex items-center justify-center gap-2">
          <div className="flex-1 bg-gray-900 text-white rounded-full px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-gray-300 mb-0.5">Konum</p>
            <p className="text-sm font-bold">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gray-900 text-white rounded-full px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-gray-300 mb-0.5">Yerini Ayır Skor</p>
            <p className="text-sm font-bold">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gray-900 text-white rounded-full px-4 py-3 text-center">
            <p className="text-[10px] font-medium text-gray-300 mb-0.5">Fiyat</p>
            <p className="text-sm font-bold">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 12,
      name: "Top Accent Line",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900"></div>
            <p className="text-xs font-medium text-gray-600 mb-1.5 mt-1">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900"></div>
            <p className="text-xs font-medium text-gray-600 mb-1.5 mt-1">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900"></div>
            <p className="text-xs font-medium text-gray-600 mb-1.5 mt-1">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 13,
      name: "Neumorphism 3D",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-2xl p-4 text-center" style={{ boxShadow: '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff' }}>
            <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
            <p className="text-lg font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-2xl p-4 text-center" style={{ boxShadow: '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff' }}>
            <p className="text-xs font-medium text-gray-600 mb-1.5">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-2xl p-4 text-center" style={{ boxShadow: '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff' }}>
            <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
            <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 14,
      name: "Left Border Accent",
      component: (
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-center">
            <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-gray-900">
              <p className="text-xs font-semibold text-gray-500 mb-2">Konum</p>
              <p className="text-xl font-bold text-gray-900">{locationCity}</p>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-gray-900">
              <p className="text-xs font-semibold text-gray-500 mb-2">Yerini Ayır Skor</p>
              <p className="text-xl font-bold text-gray-900">{rating} / 5</p>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-gray-900">
              <p className="text-xs font-semibold text-gray-500 mb-2">Fiyat</p>
              <p className="text-xl font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 15,
      name: "Modern Dark Hover",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 bg-gray-900 rounded-xl p-5 text-center transform hover:scale-105 transition-transform">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Konum</p>
            <p className="text-lg font-bold text-white">{locationCity}</p>
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl p-5 text-center transform hover:scale-105 transition-transform">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Yerini Ayır Skor</p>
            <p className="text-lg font-bold text-white">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-gray-900 rounded-xl p-5 text-center transform hover:scale-105 transition-transform">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fiyat</p>
            <p className="text-lg font-bold text-white">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 16,
      name: "Glassmorphism",
      component: (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl -mx-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 rounded-2xl p-4 text-center backdrop-blur-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <p className="text-xs font-medium text-white/80 mb-1.5">Konum</p>
              <p className="text-lg font-bold text-white">{locationCity}</p>
            </div>
            <div className="flex-1 rounded-2xl p-4 text-center backdrop-blur-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <p className="text-xs font-medium text-white/80 mb-1.5">Yerini Ayır Skor</p>
              <p className="text-lg font-bold text-white">{rating} / 5</p>
            </div>
            <div className="flex-1 rounded-2xl p-4 text-center backdrop-blur-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <p className="text-xs font-medium text-white/80 mb-1.5">Fiyat</p>
              <p className="text-lg font-bold text-white">{price.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 17,
      name: "Bold Outlined",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-2 border-gray-900 rounded-lg p-4 text-center">
            <p className="text-[11px] font-bold text-gray-600 uppercase mb-2">Konum</p>
            <p className="text-xl font-black text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-lg p-4 text-center">
            <p className="text-[11px] font-bold text-gray-600 uppercase mb-2">Yerini Ayır Skor</p>
            <p className="text-xl font-black text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-lg p-4 text-center">
            <p className="text-[11px] font-bold text-gray-600 uppercase mb-2">Fiyat</p>
            <p className="text-xl font-black text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 18,
      name: "Gradient Borders",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 p-[2px] rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
              <p className="text-lg font-bold text-gray-900">{locationCity}</p>
            </div>
          </div>
          <div className="flex-1 p-[2px] rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Yerini Ayır Skor</p>
              <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
            </div>
          </div>
          <div className="flex-1 p-[2px] rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
              <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 19,
      name: "Ultra Minimal",
      component: (
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 bg-white rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Konum</p>
            <p className="text-xl font-bold text-gray-900">{locationCity}</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">GNK Skor</p>
            <p className="text-xl font-bold text-gray-900">{rating} / 5</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Fiyat</p>
            <p className="text-xl font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      )
    },
    {
      id: 20,
      name: "Double Border Premium",
      component: (
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-1">
            <div className="border border-gray-400 rounded-lg p-3 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Konum</p>
              <p className="text-lg font-bold text-gray-900">{locationCity}</p>
            </div>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-1">
            <div className="border border-gray-400 rounded-lg p-3 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">GNK Skor</p>
              <p className="text-lg font-bold text-gray-900">{rating} / 5</p>
            </div>
          </div>
          <div className="flex-1 border-2 border-gray-900 rounded-xl p-1">
            <div className="border border-gray-400 rounded-lg p-3 text-center">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Fiyat</p>
              <p className="text-lg font-bold text-gray-900">{price.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            20 Dizayn Seçeneği
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Beğendiğiniz dizaynı seçin
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        {designs.map((design) => (
          <div key={design.id} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-900">#{design.id}</span>
                  <h3 className="text-sm font-semibold text-gray-700 mt-0.5">{design.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedDesign(design.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedDesign === design.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-900'
                    }`}
                >
                  {selectedDesign === design.id ? '✓ Seçildi' : 'Seç'}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">{hotelName}</h2>
              </div>
              {design.component}
            </div>
          </div>
        ))}
      </div>

      {selectedDesign && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-900 shadow-2xl">
          <div className="max-w-md mx-auto p-4">
            <p className="text-center text-sm text-gray-600 mb-3">
              Seçilen Dizayn: <span className="font-bold text-gray-900">#{selectedDesign}</span>
            </p>
            <button
              onClick={() => {
                alert(`Dizayn #${selectedDesign} seçildi! Şimdi bunu uygulamak için numara ${selectedDesign} olduğunu söyleyin.`);
              }}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              Bu Dizaynı Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
