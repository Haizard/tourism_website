import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrderPopup from "../OrderPopup/OrderPopup";
import "./blogdetail.css";

const BlogDetail = () => {
    const location = useLocation();
    const { image, additionalImage, date, title, description, author, itinerary } = location.state || {};

    const [isItineraryVisible, setItineraryVisible] = useState(false);
    const [isOrderPopupVisible, setOrderPopupVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(image); // Initialize with the default image

    useEffect(() => {
        // Debugging: Check the state data
        console.log("BlogDetail Location State:", location.state);
    }, [location.state]);

    useEffect(() => {
        if (isItineraryVisible && additionalImage) {
            setCurrentImage(additionalImage); // Switch to the additional image when the itinerary is visible
        } else {
            setCurrentImage(image); // Switch back to the default image when the itinerary is hidden
        }
    }, [isItineraryVisible, additionalImage, image]);

    if (!location.state) {
        return <div>No blog data available</div>; // Handle missing data
    }

    return (
        <div className="blog-detail-container">
            <div className="blog-content rounded-sm p-4">
                <div className="blog-card">
                    <img src={currentImage} alt={title} className="blog-image rounded-lg" />
                    <div className="blog-card-info">
                        <p className="blog-card-date">{date}</p>
                        <p className="blog-card-author">By {author}</p>
                    </div>
                    <div className="blog-text">
                        <h1 className="blog-title">{title}</h1>
                        <p className="blog-description">{description}</p>
                    </div>
                </div>

                {itinerary && itinerary.length > 0 && (
                    <div className="itinerary-section">
                        <button
                            className="toggle-itinerary-btn"
                            onClick={() => setItineraryVisible(!isItineraryVisible)}
                        >
                            {isItineraryVisible ? "Hide Itinerary" : "Show Itinerary"}
                        </button>
                        {isItineraryVisible && (
                            <div className="itinerary-details">
                                {itinerary.map((day, index) => (
                                    <div key={index} className="itinerary-day">
                                        <h3 className="itinerary-day-title">Day {index + 1}</h3>
                                        <ul className="itinerary-events">
                                            {day.events.map((event, eventIndex) => (
                                                <li key={eventIndex} className="itinerary-event">
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
            <div className="order-popup-container">
                <div className="order-popup">
                    <OrderPopup 
                        isVisible={isOrderPopupVisible} 
                        setOrderPopupVisible={setOrderPopupVisible} 
                        packageTour={title} // Pass the package tour title
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
