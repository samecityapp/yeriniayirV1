'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface HotelFAQProps {
  faqs: FAQItem[];
}

export function HotelFAQ({ faqs }: HotelFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-4 md:p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Sıkça Sorulan Sorular
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-1">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-sm md:text-base">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              {faq.question}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed pl-4">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
