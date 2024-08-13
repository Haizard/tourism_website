import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderPopup from "../OrderPopup/OrderPopup";
import "./blogdetail.css";

const BlogDetail = () => {
    const location = useLocation();
    const { image, date, title, description, author, itinerary } = location.state || {};
    
    const [isItineraryVisible, setItineraryVisible] = useState(false);
    const [isOrderPopupVisible, setOrderPopupVisible] = useState(false);

    useEffect(() => {
        // Debugging: Check the state data
        console.log("BlogDetail Location State:", location.state);
    }, [location.state]);

    if (!location.state) {
        return <div className="text-center py-10">No blog data available</div>; // Handle missing data
    }

    return (
        <div className="blog-detail-container py-4 px-6 sm:px-8 lg:px-12">
            <div className="blog-content rounded-lg shadow-lg p-4 bg-white">
                <div className="blog-card">
                    <img src={image} alt={title} className="blog-image rounded-lg w-full object-cover" />
                    <div className="blog-card-info mt-2">
                        <p className="blog-card-date text-gray-600 text-sm">{date}</p>
                        <p className="blog-card-author text-gray-800 text-sm">By {author}</p>
                    </div>
                    <div className="blog-text mt-4">
                        <h1 className="blog-title text-2xl font-semibold">{title}</h1>
                        <p className="blog-description mt-2 text-gray-700">{description}</p>
                    </div>
                </div>

                {itinerary && itinerary.length > 0 && (
                    <div className="itinerary-section mt-6">
                        <button
                            className="toggle-itinerary-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setItineraryVisible(!isItineraryVisible)}
                        >
                            {isItineraryVisible ? "Hide Itinerary" : "Show Itinerary"}
                        </button>
                        {isItineraryVisible && (
                            <div className="itinerary-details mt-4">
                                {itinerary.map((day, index) => (
                                    <div key={index} className="itinerary-day mb-4">
                                        <h3 className="itinerary-day-title text-xl font-semibold">Day {index + 1}</h3>
                                        <ul className="itinerary-events mt-2 list-disc list-inside">
                                            {day.events.map((event, eventIndex) => (
                                                <li key={eventIndex} className="itinerary-event text-gray-700">
                                                    {event}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="order-popup-container mt-6">
                <OrderPopup 
                    isVisible={isOrderPopupVisible} 
                    setOrderPopupVisible={setOrderPopupVisible} 
                    packageTour={title} // Pass the package tour title
                />
            </div>
        </div>
    );
};

export default BlogDetail;
