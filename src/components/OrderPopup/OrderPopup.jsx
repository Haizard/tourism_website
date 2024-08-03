import React, { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5"; // Remove if not using

const OrderForm = ({ orderPopup, setOrderPopup, packageTour }) => { // Accept packageTour as a prop
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        packageTour: packageTour || "", // Set initial value from prop
        numberOfPeople: "",
        address: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState("");

    useEffect(() => {
        // Update formData when packageTour prop changes
        setFormData((prevData) => ({
            ...prevData,
            packageTour: packageTour || "",
        }));
    }, [packageTour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus("");

        const formEndpoint = "https://formspree.io/f/xvgparpk";

        try {
            const response = await fetch(formEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus("Your message has been sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    packageTour: "",
                    numberOfPeople: "",
                    address: "",
                });
            } else {
                throw new Error("There was an issue with your submission.");
            }
        } catch (error) {
            setSubmissionStatus(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg bg-gray">
            <div className="relative">
                <button
                    className="absolute top-2 right-2 text-xl"
                    onClick={() => setOrderPopup(false)}
                >
                    <IoCloseOutline />
                </button>
                <h2 className="p-5 text-green-900">BOOK YOUR TRIP</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="packageTour"
                        placeholder="Package Tour"
                        value={formData.packageTour}
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="numberOfPeople"
                        placeholder="Number of People"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                        required
                    />
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Book Now"}
                        </button>
                    </div>
                    {submissionStatus && (
                        <div className="mt-4 text-center text-gray-700 dark:text-gray-300">
                            {submissionStatus}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
