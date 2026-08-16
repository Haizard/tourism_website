import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Information We Collect</h2>
          <p>We collect the information you provide when booking a tour or sending an inquiry: your name, email address, phone number, country, and travel preferences (dates, party size, budget).</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. How We Use Your Information</h2>
          <p>We use your details to process bookings, respond to inquiries, confirm availability, and send trip-related communications. We do not sell your personal information to third parties.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Data Security</h2>
          <p>We take reasonable measures to protect your data. Sensitive payment details, when supported in the future, will be handled by certified payment processors.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Contact</h2>
          <p>Questions about this policy? Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
