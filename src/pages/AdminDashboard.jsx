import React, { useState, useEffect } from "react";
import {
    fetchTours, createTour, updateTour, deleteTour,
    fetchGallery, createGallery, deleteGallery,
    fetchBookings, deleteBooking,
    fetchBlogs, createBlog, updateBlog, deleteBlog
} from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("packages"); // "packages", "gallery", "bookings", "blogs"
    const [tours, setTours] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [blogs, setBlogs] = useState([]);

    // Auth Check
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (auth !== "true") {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        navigate("/login");
    };

    // Form States
    const [tourFormData, setTourFormData] = useState({
        title: "", description: "", price: "", image: "", location: "",
        author: "Admin", date: "", duration: "", maxGroupSize: "",
        tourType: "Safari", category: "Standard",
        inclusions: "", exclusions: "",
        itinerary: [{ day: 1, events: "" }]
    });

    const [blogFormData, setBlogFormData] = useState({
        title: "", content: "", image: "", category: "Travel Tips", author: "Admin"
    });

    const [galleryFormData, setGalleryFormData] = useState({ img: "", location: "", caption: "" });

    const [editingTourId, setEditingTourId] = useState(null);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTours();
        loadGallery();
        loadBookings();
        loadBlogs();
    }, []);

    const loadTours = async () => { try { const res = await fetchTours(); setTours(res.data); } catch (e) { console.error(e); } };
    const loadGallery = async () => { try { const res = await fetchGallery(); setGallery(res.data); } catch (e) { console.error(e); } };
    const loadBookings = async () => { try { const res = await fetchBookings(); setBookings(res.data); } catch (e) { console.error(e); } };
    const loadBlogs = async () => { try { const res = await fetchBlogs(); setBlogs(res.data); } catch (e) { console.error(e); } };

    const handleTourInputChange = (e) => setTourFormData({ ...tourFormData, [e.target.name]: e.target.value });
    const handleBlogInputChange = (e) => setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });
    const handleGalleryInputChange = (e) => setGalleryFormData({ ...galleryFormData, [e.target.name]: e.target.value });

    // Tour Submit
    const handleTourSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const processed = {
            ...tourFormData,
            price: Number(tourFormData.price),
            inclusions: tourFormData.inclusions.split("\n").filter(i => i.trim()),
            exclusions: tourFormData.exclusions.split("\n").filter(i => i.trim()),
            itinerary: tourFormData.itinerary.map(item => ({
                day: item.day,
                events: item.events.split("\n").filter(e => e.trim())
            })).filter(item => item.events.length > 0)
        };
        try {
            if (editingTourId) await updateTour(editingTourId, processed);
            else await createTour(processed);
            setTourFormData({ ...tourFormData, title: "", description: "", price: "", image: "", location: "", inclusions: "", exclusions: "", itinerary: [{ day: 1, events: "" }] });
            setEditingTourId(null);
            loadTours();
            alert("Tour saved!");
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // Blog Submit
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingBlogId) await updateBlog(editingBlogId, blogFormData);
            else await createBlog(blogFormData);
            setBlogFormData({ title: "", content: "", image: "", category: "Travel Tips", author: "Admin" });
            setEditingBlogId(null);
            loadBlogs();
            alert("Blog saved!");
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // Gallery Submit
    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createGallery(galleryFormData);
            setGalleryFormData({ img: "", location: "", caption: "" });
            loadGallery();
            alert("Photo added to gallery!");
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="container mx-auto p-4 pt-24 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-2xl shadow-sm border">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Panel Dashboard</h1>
                    <p className="text-gray-500 font-medium">Content Management System</p>
                </div>
                <div className="flex bg-gray-100 p-1.5 rounded-xl gap-2 overflow-x-auto">
                    {["packages", "blogs", "gallery", "bookings"].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg font-bold transition capitalize ${activeTab === tab ? "bg-white text-primary shadow-sm" : "hover:bg-gray-200 text-gray-600"}`}>{tab}</button>
                    ))}
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 font-black px-6 py-2 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition">LOGOUT</button>
            </div>

            {/* Bookings Section */}
            {activeTab === "bookings" && (
                <section className="bg-white rounded-3xl shadow-2xl overflow-hidden border">
                    <div className="bg-primary p-8 text-white">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Customer Requests</h2>
                    </div>
                    <div className="p-8 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="border-b text-gray-400 text-xs uppercase font-black"><th className="pb-4">Date</th><th className="pb-4 uppercase">Customer</th><th className="pb-4">Package</th><th className="pb-4">Pax</th><th className="pb-4">Total</th><th className="pb-4 text-right">Action</th></tr></thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="py-6 text-sm font-bold text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td><p className="font-bold">{b.name}</p><p className="text-xs text-gray-500">{b.email}</p></td>
                                        <td><span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black">{b.packageTour}</span></td>
                                        <td className="font-bold">{b.pax}</td>
                                        <td className="font-black text-primary">${b.totalPrice}</td>
                                        <td className="text-right"><button onClick={() => deleteBooking(b._id).then(loadBookings)} className="text-red-400 font-bold hover:underline">Clear</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Packages Section */}
            {activeTab === "packages" && (
                <section className="bg-white p-8 rounded-3xl shadow-xl border">
                    <h2 className="text-3xl font-black mb-10 text-gray-900 uppercase">Manage Tour Packages</h2>
                    <form onSubmit={handleTourSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <input type="text" name="title" value={tourFormData.title} onChange={handleTourInputChange} placeholder="Package Title" className="bg-gray-50 p-4 rounded-xl border outline-none focus:border-primary font-bold col-span-2" required />
                            <input type="text" name="location" value={tourFormData.location} onChange={handleTourInputChange} placeholder="Location" className="bg-gray-50 p-4 rounded-xl border outline-none focus:border-primary font-bold" required />
                            <input type="number" name="price" value={tourFormData.price} onChange={handleTourInputChange} placeholder="Price ($)" className="bg-gray-50 p-4 rounded-xl border outline-none focus:border-primary font-bold" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <select name="tourType" value={tourFormData.tourType} onChange={handleTourInputChange} className="bg-gray-50 p-4 rounded-xl border outline-none border-primary text-primary font-bold">
                                <option value="Safari">Safari</option>
                                <option value="Trekking">Trekking</option>
                                <option value="Beach">Beach Holiday</option>
                                <option value="Cultural">Cultural Tour</option>
                                <option value="Day Trip">Day Trip</option>
                            </select>
                            <select name="category" value={tourFormData.category} onChange={handleTourInputChange} className="bg-gray-50 p-4 rounded-xl border outline-none font-bold">
                                <option value="Luxury">Luxury</option>
                                <option value="Mid-Range">Mid-Range</option>
                                <option value="Budget">Budget</option>
                                <option value="Family">Family Friendly</option>
                            </select>
                            <input type="text" name="duration" value={tourFormData.duration} onChange={handleTourInputChange} placeholder="Duration (e.g. 5 Days)" className="bg-gray-50 p-4 rounded-xl border outline-none" />
                            <input type="text" name="image" value={tourFormData.image} onChange={handleTourInputChange} placeholder="Image URL" className="bg-gray-50 p-4 rounded-xl border outline-none" required />
                        </div>
                        <textarea name="description" value={tourFormData.description} onChange={handleTourInputChange} placeholder="Description" className="w-full bg-gray-50 p-4 rounded-xl border h-32 outline-none" required></textarea>
                        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black p-5 rounded-2xl shadow-xl uppercase tracking-widest">{editingTourId ? "Update Package" : "Add Package"}</button>
                    </form>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tours.map(t => (
                            <div key={t._id} className="p-6 bg-gray-50 rounded-2xl border flex justify-between items-center group">
                                <div>
                                    <h4 className="font-black text-gray-900">{t.title}</h4>
                                    <p className="text-xs text-primary font-black uppercase tracking-tighter">{t.tourType} | {t.category}</p>
                                </div>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => { setEditingTourId(t._id); setTourFormData({ ...t, inclusions: t.inclusions?.join("\n"), exclusions: t.exclusions?.join("\n"), itinerary: t.itinerary?.map(i => ({ day: i.day, events: i.events.join("\n") })) || [] }); window.scrollTo(0, 0); }} className="text-blue-500 font-bold text-xs uppercase">Edit</button>
                                    <button onClick={() => deleteTour(t._id).then(loadTours)} className="text-red-400 font-bold text-xs uppercase">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Blogs Section */}
            {activeTab === "blogs" && (
                <section className="bg-white p-8 rounded-3xl shadow-xl border">
                    <h2 className="text-3xl font-black mb-10 text-gray-900 uppercase">Manage Blog Posts</h2>
                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <input type="text" name="title" value={blogFormData.title} onChange={handleBlogInputChange} placeholder="Blog Title" className="bg-gray-50 p-4 rounded-xl border font-bold col-span-3 outline-none focus:border-primary" required />
                            <select name="category" value={blogFormData.category} onChange={handleBlogInputChange} className="bg-gray-50 p-4 rounded-xl border font-bold outline-none">
                                <option value="Travel Tips">Travel Tips</option>
                                <option value="News">News</option>
                                <option value="Destinations">Destinations</option>
                                <option value="Culture">Culture</option>
                            </select>
                        </div>
                        <input type="text" name="image" value={blogFormData.image} onChange={handleBlogInputChange} placeholder="Featured Image URL" className="w-full bg-gray-50 p-4 rounded-xl border outline-none" required />
                        <textarea name="content" value={blogFormData.content} onChange={handleBlogInputChange} placeholder="Write your content here..." className="w-full bg-gray-50 p-4 rounded-xl border h-64 outline-none" required></textarea>
                        <button type="submit" disabled={loading} className="w-full bg-secondary text-white font-black p-5 rounded-2xl shadow-xl uppercase tracking-widest">{editingBlogId ? "Update Post" : "Publish Blog Post"}</button>
                    </form>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map(b => (
                            <div key={b._id} className="p-6 bg-gray-50 rounded-2xl border flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <img src={b.image} className="w-16 h-16 rounded-xl object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 leading-tight">{b.title}</h4>
                                        <p className="text-xs text-gray-400 font-black uppercase">{b.category}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => { setEditingBlogId(b._id); setBlogFormData(b); window.scrollTo(0, 0); }} className="text-blue-500 font-bold text-xs">EDIT</button>
                                    <button onClick={() => deleteBlog(b._id).then(loadBlogs)} className="text-red-400 font-bold text-xs">DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {activeTab === "gallery" && (
                <section className="bg-white p-8 rounded-3xl shadow-xl border">
                    <h2 className="text-3xl font-black mb-10 text-gray-900 uppercase">Manage Gallery</h2>
                    <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input type="text" name="img" value={galleryFormData.img} onChange={handleGalleryInputChange} placeholder="Photo URL" className="bg-gray-50 p-4 rounded-xl border outline-none" required />
                        <input type="text" name="location" value={galleryFormData.location} onChange={handleGalleryInputChange} placeholder="Location/Subject" className="bg-gray-50 p-4 rounded-xl border outline-none" required />
                        <button type="submit" className="bg-primary text-white font-black rounded-xl">Add Photo</button>
                    </form>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                        {gallery.map(img => (
                            <div key={img._id} className="relative aspect-square group rounded-xl overflow-hidden shadow-sm">
                                <img src={img.img} className="w-full h-full object-cover" />
                                <button onClick={() => deleteGallery(img._id).then(loadGallery)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition font-black uppercase text-xs">Delete</button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminDashboard;
