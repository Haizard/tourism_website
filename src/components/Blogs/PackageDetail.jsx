import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderPopup from "../OrderPopup/OrderPopup";
import { IoTimeOutline, IoPeopleOutline, IoLocationOutline } from "react-icons/io5";

const PackageDetail = () => {
    const location = useLocation();
    const {
        image, title, location: loc, price, description,
        tourType, category, itinerary, inclusions, exclusions,
        duration, maxGroupSize
    } = location.state || {};

    const [isOrderPopupVisible, setOrderPopupVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!location.state) return <div className="text-center py-20">No package data found</div>;

    return (
        <div className="pb-20 pt-24 px-4 lg:px-24 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border">
                <div className="relative h-[500px]">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-12">
                        <div className="flex gap-2 mb-4">
                            <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-black uppercase">{tourType}</span>
                            <span className="bg-secondary text-white px-4 py-1 rounded-full text-xs font-black uppercase">{category}</span>
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">{title}</h1>
                        <div className="flex items-center gap-6 text-white/80 font-bold">
                            <span className="flex items-center gap-2"><IoLocationOutline className="text-primary text-xl" /> {loc}</span>
                            <span className="flex items-center gap-2"><IoTimeOutline className="text-primary text-xl" /> {duration || "5 Days"}</span>
                        </div>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 underline decoration-primary decoration-4 underline-offset-8">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{description}</p>
                        </div>

                        {itinerary && (
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">Planned Itinerary</h2>
                                <div className="space-y-6">
                                    {itinerary.map((day, i) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0">{day.day}</div>
                                            <div className="bg-gray-50 p-6 rounded-3xl flex-1 border">
                                                <ul className="space-y-2">
                                                    {day.events.map((e, ei) => <li key={ei} className="text-gray-700 text-sm italic">• {e}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-900 text-white p-8 rounded-[32px] shadow-xl">
                            <p className="text-gray-400 font-black uppercase text-xs mb-2 tracking-widest">Starting From</p>
                            <h3 className="text-5xl font-black text-primary mb-6">${price}<span className="text-sm text-gray-400">/PP</span></h3>
                            <button onClick={() => setOrderPopupVisible(true)} className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-white hover:text-primary transition shadow-lg uppercase tracking-widest">Book This Tour</button>
                        </div>

                        <div className="border p-8 rounded-[32px] space-y-6">
                            <h4 className="font-black uppercase tracking-tight text-gray-900">What's Included</h4>
                            <ul className="space-y-3">
                                {inclusions?.map((inc, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">✅ {inc}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <OrderPopup
                isVisible={isOrderPopupVisible}
                setOrderPopupVisible={setOrderPopupVisible}
                packageTour={title}
                packagePrice={price}
            />
        </div>
    );
};

export default PackageDetail;
