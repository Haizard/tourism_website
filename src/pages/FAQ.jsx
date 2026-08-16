import React, { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const faqs = [
  { q: "When is the best time to visit Tanzania for a safari?", a: "The dry season (June to October) offers the best wildlife viewing, including the Great Migration in the Serengeti. The green season (November to May) is ideal for birding, lush landscapes, and calving season in the Ndutu plains." },
  { q: "What is included in the tour price?", a: "Each package lists inclusions and exclusions explicitly. Most safaris include park fees, 4x4 transport, professional guide, and accommodation. Flights, visas, and personal expenses are typically excluded." },
  { q: "How do I book a tour?", a: "Click 'Book This Tour' on any package, fill in your travel date and party size, and submit. We respond within 24 hours to confirm availability." },
  { q: "Do you offer custom or tailor-made tours?", a: "Yes! Visit our Tailor-Made page to design your own itinerary with flights, hotels, guides, and transport." },
  { q: "Is Tanzania safe for tourists?", a: "Tanzania is a welcoming, politically stable country. We use licensed guides, insured vehicles, and vetted lodges to ensure your safety throughout." },
  { q: "What should I pack?", a: "Neutral-colored clothing, comfortable walking shoes, sunscreen, insect repellent, a light jacket for mornings, binoculars, and your camera with extra batteries." },
  { q: "Do I need a visa or vaccinations?", a: "Most visitors need a visa for Tanzania. Yellow fever vaccination is recommended, and antimalarial medication is advised. Check with your doctor before travel." },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-500 font-medium mb-10">Everything you need to know before your adventure.</p>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center p-6 text-left">
                <h3 className="font-black text-gray-900 uppercase tracking-tight">{f.q}</h3>
                <div className="text-primary text-xl shrink-0 ml-4">{open === i ? <IoChevronUpOutline /> : <IoChevronDownOutline />}</div>
              </button>
              {open === i && <p className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
