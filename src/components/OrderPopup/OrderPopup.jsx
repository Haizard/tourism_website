import React, { useState, useEffect } from "react";
import { IoCloseOutline, IoPeopleOutline, IoWalletOutline } from "react-icons/io5";
import { createBooking } from "../../services/api";

const OrderPopup = ({ isVisible, setOrderPopupVisible, packageTour, packagePrice }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        packageTour: packageTour || "Custom Inquiry",
        pax: 1,
        totalPrice: packagePrice || 0
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Update total price when pax or packagePrice changes
    useEffect(() => {
        if (packagePrice) {
            setFormData(prev => ({
                ...prev,
                packageTour: packageTour || prev.packageTour,
                totalPrice: prev.pax * packagePrice
            }));
        }
    }, [formData.pax, packagePrice, packageTour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createBooking(formData);
            setSuccess(true);
            setTimeout(() => {
                setOrderPopupVisible(false);
                setSuccess(false);
                setFormData({ ...formData, name: "", email: "", address: "", phone: "", pax: 1 });
            }, 2000);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to submit booking. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-[450px] bg-white rounded-3xl p-8 shadow-2xl relative">
                {/* Close Button */}
                <div className="absolute top-4 right-4 text-2xl cursor-pointer hover:text-primary transition" onClick={() => setOrderPopupVisible(false)}>
                    <IoCloseOutline />
                </div>

                {success ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase mb-2">Success!</h2>
                        <p className="text-gray-500">Your booking request has been sent.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Book Your Spot</h1>
                            <p className="text-gray-500 text-sm">Package: <span className="text-primary font-bold">{packageTour || "General Inquiry"}</span></p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    required
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Country"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    required
                                />
                            </div>

                            {/* Price Calculation Box */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase"><IoPeopleOutline className="text-lg" /> Number of People</label>
                                    <input
                                        type="number"
                                        name="pax"
                                        min="1"
                                        max="100"
                                        value={formData.pax}
                                        onChange={(e) => setFormData({ ...formData, pax: parseInt(e.target.value) || 1 })}
                                        className="w-20 bg-white border p-2 rounded-xl text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="border-t pt-4 flex items-center justify-between">
                                    <p className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase"><IoWalletOutline className="text-lg" /> Total Price</p>
                                    <p className="text-2xl font-black text-primary">${formData.totalPrice}</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all disabled:bg-gray-400 mt-4 uppercase tracking-widest"
                            >
                                {loading ? "Submitting..." : "Confirm & Pay Later"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderPopup;
