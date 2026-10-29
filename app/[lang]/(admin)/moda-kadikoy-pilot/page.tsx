'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MODA_REFERENCE_ORIGIN,
  MODA_KADIKOY_GEOGRAPHY,
  MODA_KADIKOY_CATEGORY_ARCHITECTURE,
  MODA_KADIKOY_COFFEE_CANDIDATES,
  CoffeeCandidateDossier,
  EvidenceRecord,
} from '@/lib/pilot/modaKadikoyCoffeePilot';
import { RestaurantCard } from '@/components/nearby-places/RestaurantCard';
import { getLocalizedText } from '@/lib/localization';

export default function ModaKadikoyPilotPage() {
  const [candidates, setCandidates] = useState<CoffeeCandidateDossier[]>(MODA_KADIKOY_COFFEE_CANDIDATES);
  const [activeTab, setActiveTab] = useState<'approved' | 'all' | 'geo' | 'architecture' | 'audit'>('approved');
  const [selectedCandidate, setSelectedCandidate] = useState<CoffeeCandidateDossier | null>(
    MODA_KADIKOY_COFFEE_CANDIDATES[0]
  );
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const top3 = candidates.filter((c) => c.status === 'selected_top_3');

  const handleDecision = (candidateId: string, decision: CoffeeCandidateDossier['adminDecision']) => {
    if (!adminPasswordInput.trim()) {
      setActionMessage({
        text: 'Güvenlik Uyarısı: İşlem yapabilmek için yönetici anahtarınızı giriniz.',
        type: 'error',
      });
      return;
    }

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, adminDecision: decision } : c))
    );

    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, adminDecision: decision } : null));
    }

    setActionMessage({
      text: `Aday (${candidateId}) durumu "${decision}" olarak güncellendi. (Canlı Supabase verisine dokunulmadı - Staging Bellek Modu)`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                PİLOT #1 • MODA–KADIKÖY
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Astra & Argon Araştırma Modeli
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Yapay Skorlama Kaldırıldı
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
              Moda Nitelikli Kahve Algoritma Onay Ekranı
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="password"
              placeholder="Admin Güvenlik Anahtarı"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="text-xs px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Link
              href="/tr"
              className="text-xs font-medium px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Action Notification */}
      {actionMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-3 rounded-xl text-sm font-medium flex items-center justify-between ${
              actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-xs font-bold underline ml-4">
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'approved' ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ☕ Seçilen En İyi 3 Kahveci ({top3.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'all' ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 İncelenen & Ayrıştırılan Tüm Adaylar ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'geo' ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🗺️ Coğrafi Hiyerarşi & Rota Doğrulama
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'architecture' ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏗️ 7 Kategori Mimarisi
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 'audit' ? 'bg-amber-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛡️ Güvenlik & RLS Denetim Raporu
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: APPROVED TOP 3 */}
        {activeTab === 'approved' && (
          <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
                <span>🎯</span> Neden Bu 3 İşletme Seçildi?
              </h2>
              <p className="text-sm text-amber-800 mt-1">
                Astra & Argon kuralları gereğince yapay yüzdelik puanlama (94.2, 91.6 vb.) kaldırılmıştır.
                Her işletme; <strong>Ürün Kalitesi Bulguları</strong> (çekirdek, kavurma, demleme),{' '}
                <strong>Kanıt Güvenilirliği</strong> (bağımsız uluslararası/ulusal kaynak aileleri) ve{' '}
                <strong>Ziyaretçi Uygunluğu</strong> (mekan tipi, oturum, tempo) olmak üzere 3 bağımsız boyutta doğrulanmıştır.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((cand, idx) => (
                <div
                  key={cand.id}
                  className={`border-2 rounded-2xl p-4 bg-white transition cursor-pointer flex flex-col justify-between ${
                    selectedCandidate?.id === cand.id ? 'border-amber-500 shadow-lg ring-2 ring-amber-200' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedCandidate(cand)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center">
                        #{cand.selectionOrder ?? idx + 1}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        {cand.adminDecision === 'pending_review' ? 'Yönetici Onayı Bekliyor' : cand.adminDecision}
                      </span>
                    </div>

                    <div className="mb-4">
                      <RestaurantCard
                        restaurant={cand.restaurantCardData}
                        lang="tr"
                        onViewDetails={() => setSelectedCandidate(cand)}
                      />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-700 block mb-0.5">📍 Doğrulanan Şube:</span>
                        <p className="text-gray-600">{cand.branchVerification.verifiedBranchName}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">{cand.branchVerification.streetAddress}</p>
                      </div>

                      <div className="p-2.5 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-700 block mb-0.5">🚶 OSRM Yaya Rotası:</span>
                        <p className="text-gray-900 font-semibold">{cand.routingVerification.formattedWalkingSummary}</p>
                      </div>

                      <div className="p-2.5 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-700 block mb-0.5">☕ Ne İçmeli?</span>
                        <p className="text-amber-900 font-bold">{cand.drinkVerification.primaryOrderSuggestion}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(cand);
                    }}
                    className="mt-4 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-xs text-center border border-amber-200 transition"
                  >
                    Detaylı Kanıt Dosyasını İncele →
                  </button>
                </div>
              ))}
            </div>

            {/* Selected Candidate Detailed Dossier Modal/Section */}
            {selectedCandidate && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        Aday Dosyası #{selectedCandidate.selectionOrder ?? 1}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">ID: {selectedCandidate.id}</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mt-1">
                      {getLocalizedText(selectedCandidate.restaurantCardData.name, 'tr')}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleDecision(selectedCandidate.id, 'approved_for_staging')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      ✓ Staging İçin Onayla
                    </button>
                    <button
                      onClick={() => handleDecision(selectedCandidate.id, 'revision_requested')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      ⚠️ Revizyon İste
                    </button>
                    <button
                      onClick={() => handleDecision(selectedCandidate.id, 'rejected')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      ✕ Reddet
                    </button>
                  </div>
                </div>

                {/* 3 Separate Evaluation Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                  {/* Dimension 1: Product Quality */}
                  <div className="p-5 bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-100 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-1">
                      1. Ürün Kalitesi Bulguları
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mb-3">
                      {selectedCandidate.evaluation.productQualityFindings.tierLabel}
                    </h3>
                    <div className="space-y-3 text-xs text-gray-700">
                      <div>
                        <span className="font-semibold text-gray-900 block">Çekirdek & Kavurma:</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                          {selectedCandidate.evaluation.productQualityFindings.beanAndRoastingFindings.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">Demleme & İçecekler:</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                          {selectedCandidate.evaluation.productQualityFindings.brewingAndDrinkFindings.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">Tutarlılık:</span>
                        <p className="text-gray-600 mt-0.5">{selectedCandidate.evaluation.productQualityFindings.consistencyNotes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dimension 2: Evidence Reliability */}
                  <div className="p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-800 block mb-1">
                      2. Kanıt Güvenilirliği & Şeffaflık
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mb-3">
                      {selectedCandidate.evaluation.evidenceReliability.tierLabel}
                    </h3>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span>Bağımsız Kaynak Ailesi:</span>
                        <strong className="text-blue-900">{selectedCandidate.evaluation.evidenceReliability.independentSourceFamilyCount} Aile</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span>1. Parti Doğrulama:</span>
                        <strong className="text-blue-900">{selectedCandidate.evaluation.evidenceReliability.firstPartyRegistryCount} Kayıt</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span>Tekilleştirilen / Düşük Nitelikli:</span>
                        <strong className="text-blue-900">{selectedCandidate.evaluation.evidenceReliability.excludedSyndicatedOrSponsoredCount} Kaynak</strong>
                      </div>
                      <div className="pt-2">
                        <span className="font-semibold text-gray-900 block">Tarihsel Tazelik:</span>
                        <p className="text-gray-600 mt-0.5">{selectedCandidate.evaluation.evidenceReliability.dateFreshnessAssessment}</p>
                      </div>
                      <div className="pt-1">
                        <span className="font-semibold text-gray-900 block">Şube Netliği:</span>
                        <p className="text-gray-600 mt-0.5">{selectedCandidate.evaluation.evidenceReliability.branchPrecisionAssessment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dimension 3: Visitor Fit */}
                  <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block mb-1">
                      3. Ziyaretçi Uygunluğu & Atmosfer
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mb-3">
                      {selectedCandidate.evaluation.visitorFit.tierLabel}
                    </h3>
                    <div className="space-y-3 text-xs text-gray-700">
                      <div>
                        <span className="font-semibold text-emerald-900 block">Kimler İçin Uygun?</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                          {selectedCandidate.evaluation.visitorFit.bestSuitedFor.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-rose-900 block">Kimler İçin Uygun Değil?</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-600">
                          {selectedCandidate.evaluation.visitorFit.notSuitedFor.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">Oturum & Mekan Ritmi:</span>
                        <p className="text-gray-600 mt-0.5">{selectedCandidate.evaluation.visitorFit.seatingAndAtmosphereContext}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Records Table */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
                    <span>📑 İncelenen Doğrulanmış Kaynaklar ({selectedCandidate.evidenceRecords.length})</span>
                    <span className="text-xs font-normal text-gray-500">Google Puanı tek başına seçim ölçütü yapılmamıştır</span>
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-bold">
                        <tr>
                          <th className="px-3 py-2.5 text-left">Kaynak Ailesi & Yayıncı</th>
                          <th className="px-3 py-2.5 text-left">Yazar & Başlık</th>
                          <th className="px-3 py-2.5 text-left">Yayın / Deneyim Tarihi</th>
                          <th className="px-3 py-2.5 text-left">Belirtilen Şube</th>
                          <th className="px-3 py-2.5 text-left">Somut İçecek Deneyimi</th>
                          <th className="px-3 py-2.5 text-left">Bağımsızlık & Lisans</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {selectedCandidate.evidenceRecords.map((ev) => (
                          <tr key={ev.id} className="hover:bg-gray-50/60">
                            <td className="px-3 py-2.5">
                              <span className="font-bold text-gray-900 block">{ev.publisher}</span>
                              <span className="text-[11px] text-gray-500">{ev.sourceFamilyName}</span>
                            </td>
                            <td className="px-3 py-2.5 max-w-xs">
                              <a
                                href={ev.exactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 hover:underline block truncate"
                              >
                                {ev.title}
                              </a>
                              <span className="text-[11px] text-gray-500">Yazar: {ev.author}</span>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className="font-semibold text-gray-800 block">{ev.publicationDate}</span>
                              <span className="text-[11px] text-gray-500">{ev.experienceDateNote}</span>
                            </td>
                            <td className="px-3 py-2.5 text-gray-700">{ev.branchMentioned}</td>
                            <td className="px-3 py-2.5 text-gray-700 max-w-xs">{ev.concreteDrinkExperience}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ev.countedAsIndependentQualityEvidence
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {ev.independenceLevel}
                              </span>
                              <p className="text-[10px] text-gray-500 mt-0.5">{ev.commercialRelationshipNote}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contradictions & Unresolved Critiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                    <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-2">
                      ⚠️ Karşıt Görüşler & Ziyaretçi Eleştirileri
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-rose-800">
                      {selectedCandidate.contradictionsAndCritiques.opposingVisitorViews.length > 0 ? (
                        selectedCandidate.contradictionsAndCritiques.opposingVisitorViews.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))
                      ) : (
                        <li>Belirgin karşıt görüş saptanmadı.</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                      🔍 Çözümlenen / Açık Kalan Çelişkiler
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                      {selectedCandidate.contradictionsAndCritiques.unresolvedContradictions.length > 0 ? (
                        selectedCandidate.contradictionsAndCritiques.unresolvedContradictions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))
                      ) : (
                        <li>Şube veya kimlik çelişkisi bulunmuyor.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL CANDIDATES & RECLASSIFICATIONS */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Kabul Testi Eleme ve Kategori Ayrıştırma Sonuçları
              </h2>
              <p className="text-xs text-gray-600">
                Sırf 3 adayı doldurmak için kategori dışı mekan eklenmez. Rafine Moda (Fine Cuisine/Brunch) kahve
                kavurucusu olmadığı için elenmiş ve brunch kategorisine aktarılmıştır.
              </p>
            </div>

            <div className="space-y-4">
              {candidates.map((cand, idx) => (
                <div
                  key={cand.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-amber-400 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 font-black text-xs flex items-center justify-center">
                        #{cand.selectionOrder ?? idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {getLocalizedText(cand.restaurantCardData.name, 'tr')}
                        </h3>
                        <p className="text-xs text-gray-500">{cand.branchVerification.streetAddress}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        cand.status === 'selected_top_3'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cand.status === 'comparative_runner_up'
                          ? 'bg-blue-100 text-blue-800'
                          : cand.status === 'reclassified_brunch_fine_cuisine'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cand.status === 'selected_top_3'
                        ? 'En İyi 3 Seçildi'
                        : cand.status === 'comparative_runner_up'
                        ? '4. Karşılaştırmalı Yedek'
                        : cand.status === 'reclassified_brunch_fine_cuisine'
                        ? 'Kategori Dışı — Brunch / Fine Cuisine Aktarıldı'
                        : cand.status === 'reclassified_bakery_croissant'
                        ? 'Kategori Dışı — Fırın / Kruvasan'
                        : 'KAPALI ŞUBE — Elendi'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-gray-700 block">Neden Bu Karar Verildi?</span>
                      <p className="text-gray-600 mt-1">{cand.whySelectedOrEliminated[0]}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">OSRM Yürüme Mesafesi:</span>
                      <p className="text-gray-900 font-medium mt-1">{cand.routingVerification.formattedWalkingSummary}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 block">Güvenilirlik Değerlendirmesi:</span>
                      <p className="text-gray-600 mt-1">{cand.evaluation.evidenceReliability.tierLabel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GEOGRAPHY & ROUTING */}
        {activeTab === 'geo' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">
                Coğrafi Yakınlık ve Rota Doğrulama Metodolojisi
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {MODA_REFERENCE_ORIGIN.methodologyNote}
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Sabit Başlangıç Noktası:</strong> {MODA_REFERENCE_ORIGIN.name} (
                {MODA_REFERENCE_ORIGIN.coordinates.lat}, {MODA_REFERENCE_ORIGIN.coordinates.lng})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODA_KADIKOY_GEOGRAPHY.map((node) => (
                <div key={node.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gray-100 text-gray-800">
                      {node.type}
                    </span>
                    <span className="text-xs font-mono text-gray-400">Yarıçap: {node.radiusMeters}m</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{node.name}</h3>
                  <p className="text-xs text-gray-600">{node.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORY ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Ürün Kuralı: Bölge Gastronomik Kimliği (Maksimum 7 Kategori)
              </h2>
              <p className="text-xs text-gray-600">
                Her bölgede <strong>"Mutlaka Denenmesi Gerekenler"</strong> ilk sırada yer alır. Diğer kategoriler ise
                semtin gastronomik kimliğine göre belirlenir ve maksimum 7 slot ile sınırlanır.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODA_KADIKOY_CATEGORY_ARCHITECTURE.map((slot) => (
                <div
                  key={slot.slug}
                  className={`border rounded-2xl p-5 ${
                    slot.isPilotActive ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-700">Slot #{slot.order}</span>
                    {slot.isPilotActive ? (
                      <span className="text-[11px] px-2 py-0.5 bg-amber-500 text-white font-bold rounded-full">
                        AKTİF PİLOT
                      </span>
                    ) : slot.isMandatoryFirst ? (
                      <span className="text-[11px] px-2 py-0.5 bg-gray-900 text-white font-bold rounded-full">
                        ZORUNLU İLK SIRA
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{slot.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{slot.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT & SECURITY REPORT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">
                Güvenlik ve Supabase RLS Doğrulama Raporu
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Kritik güvenlik açıklarına yönelik yapılan kod düzenlemeleri ve PostgreSQL 16 PGlite test sonuçları:
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <strong>1. middleware.ts Sertleştirildi:</strong>
                  <p className="mt-1">
                    Yönetici şifresi yedeği (hardcoded fallback) tamamen kaldırıldı. <code>ADMIN_PASSWORD</code> ortam değişkeni
                    tanımlı değilse fail-closed (503 Service Unavailable) dönecek şekilde düzenlendi.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <strong>2. lib/supabase-admin.ts İstemci Koruması & Log Temizliği:</strong>
                  <p className="mt-1">
                    Anahtar önek loglaması (substring log) kaldırıldı. Yanlışlıkla istemci bileşeninde çağrılması durumunda
                    anında hata fırlatan istemci koruması eklendi.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <strong>3. Supabase RLS Kapatma Migration'ı Hazırlandı:</strong>
                  <p className="mt-1">
                    <code>supabase/migrations/20261029193000_lockdown_rls_policies.sql</code> dosyası oluşturuldu.
                    Anonim kullanıcıların <code>INSERT / UPDATE / DELETE</code> yetkileri iptal edildi.
                    Yalnızca <code>SELECT (read-only)</code> izni açık bırakıldı.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
