import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Cancellation & Refund Policy</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Cancellations</h2>
          <p>Please notify us as soon as possible if you need to cancel. Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span> with your booking reference.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. Refunds</h2>
          <p>Refund eligibility depends on the suppliers involved (lodges, guides, transport). Any amounts already paid to third-party suppliers may not be refundable.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Operator Cancellation</h2>
          <p>If we must cancel a trip due to insufficient numbers or safety concerns, you will be offered an alternative date or a full refund.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Force Majeure</h2>
          <p>We are not liable for cancellations caused by natural disasters, government restrictions, or other events beyond our control.</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
