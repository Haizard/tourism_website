import React, { useState, useEffect } from "react";
import { IoCloseOutline, IoPeopleOutline, IoWalletOutline } from "react-icons/io5";
import { createBooking } from "../../services/api";

const OrderPopup = ({ isVisible, setOrderPopupVisible, packageTour, packagePrice, childDiscountPercent = 0 }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    packageTour: packageTour || "Custom Inquiry",
    adults: 1,
    children: 0,
    travelDate: "",
    referralSource: "",
    totalPrice: packagePrice || 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const pricePerAdult = packagePrice || 0;
  const minTravelDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      packageTour: packageTour || prev.packageTour,
    }));
  }, [packageTour, packagePrice]);

  const calcTotal = (adults, children) => {
    const childPrice = pricePerAdult * (1 - (childDiscountPercent || 0) / 100);
    return Math.round((adults * pricePerAdult + children * childPrice) * 100) / 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      packageTour: formData.packageTour,
      adults: Number(formData.adults),
      children: Number(formData.children),
      travelDate: formData.travelDate,
      referralSource: formData.referralSource,
      totalPrice: calcTotal(Number(formData.adults), Number(formData.children)),
    };
    try {
      const res = await createBooking(payload);
      setBookingRef(res.data.bookingRef || "");
      setSuccess(true);
      setTimeout(() => {
        setOrderPopupVisible(false);
        setSuccess(false);
        setBookingRef("");
        setFormData({
          ...formData,
          name: "",
          email: "",
          phone: "",
          address: "",
          adults: 1,
          children: 0,
          travelDate: "",
          referralSource: "",
          totalPrice: packagePrice || 0,
        });
      }, 2500);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit booking. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-[480px] bg-white rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 right-4 text-2xl cursor-pointer hover:text-primary transition" onClick={() => setOrderPopupVisible(false)}>
          <IoCloseOutline />
        </div>

        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-2">Booking Requested!</h2>
            <p className="text-gray-500">Your booking reference:</p>
            <p className="text-3xl font-black text-primary my-3">{bookingRef}</p>
            <p className="text-gray-400 text-sm">We'll confirm availability within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Book Your Spot</h1>
              <p className="text-gray-500 text-sm">
                Package: <span className="text-primary font-bold">{packageTour || "General Inquiry"}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
                <input type="text" name="address" placeholder="Country" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
              </div>

              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Travel Date</label>
                  <input type="date" name="travelDate" min={minTravelDate} value={formData.travelDate} onChange={handleChange} className="w-full bg-white border p-3 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase mb-1"><IoPeopleOutline className="text-lg" /> Adults</label>
                    <input type="number" name="adults" min="1" max="50" value={formData.adults} onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })} className="w-full bg-white border p-3 rounded-xl text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase mb-1"><IoPeopleOutline className="text-lg" /> Children</label>
                    <input type="number" name="children" min="0" max="20" value={formData.children} onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })} className="w-full bg-white border p-3 rounded-xl text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 mb-1 block">How did you hear about us?</label>
                  <select name="referralSource" value={formData.referralSource} onChange={handleChange} className="w-full bg-white border p-3 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select...</option>
                    <option value="Google">Google</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Friend/Family">Friend / Family</option>
                    <option value="Repeat Client">Repeat Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase"><IoWalletOutline className="text-lg" /> Total Price</p>
                  <p className="text-2xl font-black text-primary">${calcTotal(Number(formData.adults), Number(formData.children)).toLocaleString()}</p>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all disabled:bg-gray-400 mt-4 uppercase tracking-widest">
                {loading ? "Submitting..." : "Confirm Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPopup;
