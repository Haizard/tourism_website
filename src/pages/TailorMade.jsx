import React, { useState } from "react";
import { createInquiry } from "../services/api";
import {
  FaPlane,
  FaHotel,
  FaCamera,
  FaCarSide,
  FaSuitcaseRolling,
} from "react-icons/fa";

const TailorMade = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destinations: "",
    duration: "",
    budget: "",
    services: [],
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const servicesList = [
    { id: "flights", label: "Flight Assistance", icon: <FaPlane /> },
    { id: "hotels", label: "Luxury Hotels", icon: <FaHotel /> },
    { id: "photography", label: "Photography Guide", icon: <FaCamera /> },
    { id: "transport", label: "Private Transport", icon: <FaCarSide /> },
    { id: "gear", label: "Hiking Gear", icon: <FaSuitcaseRolling /> },
  ];

  const handleServiceToggle = (service) => {
    if (formData.services.includes(service)) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s !== service),
      });
    } else {
      setFormData({ ...formData, services: [...formData.services, service] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createInquiry(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        destinations: "",
        duration: "",
        budget: "",
        services: [],
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error sending inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-primary p-10 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
                Tailor Made Adventures
              </h1>
              <p className="text-primary-foreground/80 font-medium text-sm leading-relaxed">
                You define the dream, we make it happen. From private guides to
                luxury lodges, design your own Tanzanian safari.
              </p>
            </div>
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">
                  1
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  Share Your Ideas
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">
                  2
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  Consult Experts
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">
                  3
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">
                  Start Your Journey
                </p>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="md:w-2/3 p-10">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
                  ✓
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                  Request Received!
                </h2>
                <p className="text-gray-500 mb-8 font-medium">
                  Our travel experts will contact you within 24 hours to
                  finalize your custom itinerary.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-primary text-white font-black px-8 py-3 rounded-full uppercase tracking-widest text-sm shadow-xl"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Destinations
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.destinations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destinations: e.target.value,
                        })
                      }
                      placeholder="e.g. Serengeti, Ngorongoro"
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Phon Number
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+255..."
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Duration
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g. 7 Days"
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Approx Budget ($)
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="e.g. 2000"
                      className="w-full bg-gray-50 p-4 rounded-2xl border outline-none focus:border-primary font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Additional Services
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {servicesList.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleServiceToggle(service.label)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all ${
                          formData.services.includes(service.label)
                            ? "bg-primary text-white border-primary shadow-lg scale-105"
                            : "bg-white text-gray-600 border-gray-100 hover:border-primary/30"
                        }`}
                      >
                        {service.icon}
                        {service.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                    Your Message & Requirements
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more about your group size, interests, or any special requests..."
                    className="w-full bg-gray-50 p-4 rounded-2xl border h-32 outline-none focus:border-primary font-medium"
                  ></textarea>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primary text-white font-black py-5 rounded-[20px] shadow-2xl uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  {loading ? "Sending..." : "Request My Custom Tour"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorMade;
