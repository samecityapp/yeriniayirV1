import FoodGuideCard from '@/components/ui/FoodGuideCard';

export default function PreviewFoodCardPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Food Guide Card Design Preview</h1>

                {/* Scenario 1: Desktop Grid (Same as Home) */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">1. Desktop Grid Context (Grid cols-4)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <FoodGuideCard locationName="Bodrum" />
                        <FoodGuideCard locationName="Çeşme" />

                        {/* Placeholder to show alignment */}
                        <div className="h-full bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 p-8">
                            Other Hotel Card
                        </div>
                    </div>
                </section>

                {/* Scenario 2: Mobile View (Same as Home) */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">2. Mobile / Narrow Context</h2>
                    <div className="w-[calc(100vw-7rem)] max-w-sm">
                        <FoodGuideCard locationName="Antalya" />
                    </div>
                </section>

                {/* Scenario 3: Hover State Test */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">3. Isolated Card</h2>
                    <div className="w-80">
                        <FoodGuideCard locationName="İstanbul" />
                    </div>
                </section>
            </div>
        </div>
    );
}
