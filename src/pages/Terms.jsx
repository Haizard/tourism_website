import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Terms & Conditions</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Booking Confirmation</h2>
          <p>All bookings are subject to availability. A booking is confirmed once we respond to your request. In the future, a deposit may be required to secure your reservation.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. Pricing</h2>
          <p>Prices are quoted per adult unless stated otherwise. Child pricing applies as indicated on each package. Prices may change based on seasonality and availability.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Traveler Responsibility</h2>
          <p>Travelers are responsible for valid passports, visas, and any required vaccinations. Please verify entry requirements before booking.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Liability</h2>
          <p>Makolo Adventure Tours acts as an organizer of travel services. We are not liable for events beyond our reasonable control including weather, flight delays, or force majeure.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">5. Contact</h2>
          <p>Questions? Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
