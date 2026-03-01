import React, { useState, useEffect } from "react";
import {
  fetchTours,
  createTour,
  updateTour,
  deleteTour,
  fetchGallery,
  createGallery,
  deleteGallery,
  fetchBookings,
  deleteBooking,
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  generateAiBlog,
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  fetchTaxonomies,
  createTaxonomy,
  deleteTaxonomy,
} from "../services/api";
import { useNavigate } from "react-router-dom";

import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import AdminSidebar from "../components/Admin/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("packages");
  const [tours, setTours] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [taxonomies, setTaxonomies] = useState([]);

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
    title: "",
    description: "",
    price: "",
    image: "",
    location: "",
    author: "Admin",
    date: "",
    duration: "",
    maxGroupSize: "",
    tourType: "Safari",
    category: "Standard",
    inclusions: "",
    exclusions: "",
    itinerary: [{ day: 1, events: "" }],
    isGroupTour: false,
    maxCapacity: 12,
    currentBookings: 0,
    launchDate: "",
  });

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "Travel Tips",
    author: "Admin",
  });

  const [galleryFormData, setGalleryFormData] = useState({
    img: "",
    location: "",
    caption: "",
  });
  const [taxFormData, setTaxFormData] = useState({
    name: "",
    type: "tourType",
  });

  const [editingTourId, setEditingTourId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTours();
    loadGallery();
    loadBookings();
    loadBlogs();
    loadInquiries();
    loadTaxonomies();
  }, []);

  const loadTours = async () => {
    try {
      const res = await fetchTours();
      setTours(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const loadGallery = async () => {
    try {
      const res = await fetchGallery();
      setGallery(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const loadBookings = async () => {
    try {
      const res = await fetchBookings();
      setBookings(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const loadBlogs = async () => {
    try {
      const res = await fetchBlogs();
      setBlogs(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const loadInquiries = async () => {
    try {
      const res = await fetchInquiries();
      setInquiries(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const loadTaxonomies = async () => {
    try {
      const res = await fetchTaxonomies();
      setTaxonomies(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTourInputChange = (e) =>
    setTourFormData({ ...tourFormData, [e.target.name]: e.target.value });
  const handleBlogInputChange = (e) =>
    setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });
  const handleGalleryInputChange = (e) =>
    setGalleryFormData({ ...galleryFormData, [e.target.name]: e.target.value });

  // Tour Submit
  const handleTourSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const processed = {
      ...tourFormData,
      price: Number(tourFormData.price),
      inclusions: tourFormData.inclusions.split("\n").filter((i) => i.trim()),
      exclusions: tourFormData.exclusions.split("\n").filter((i) => i.trim()),
      itinerary: tourFormData.itinerary
        .map((item) => ({
          day: item.day,
          events: item.events.split("\n").filter((e) => e.trim()),
        }))
        .filter((item) => item.events.length > 0),
    };
    try {
      if (editingTourId) await updateTour(editingTourId, processed);
      else await createTour(processed);
      setTourFormData({
        ...tourFormData,
        title: "",
        description: "",
        price: "",
        image: "",
        location: "",
        inclusions: "",
        exclusions: "",
        itinerary: [{ day: 1, events: "" }],
      });
      setEditingTourId(null);
      loadTours();
      alert("Tour saved!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Blog Submit
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBlogId) await updateBlog(editingBlogId, blogFormData);
      else await createBlog(blogFormData);
      setBlogFormData({
        title: "",
        content: "",
        image: "",
        category: "Travel Tips",
        author: "Admin",
      });
      setEditingBlogId(null);
      loadBlogs();
      alert("Blog saved!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Taxonomy Submit
  const handleTaxSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTaxonomy(taxFormData);
      setTaxFormData({ name: "", type: "tourType" });
      loadTaxonomies();
      alert("Filter created!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Form logic to ensure initial values for selects match taxonomies
  useEffect(() => {
    if (taxonomies.length > 0) {
      const firstType =
        taxonomies.find((t) => t.type === "tourType")?.name || "Safari";
      const firstCat =
        taxonomies.find((t) => t.type === "tourCategory")?.name || "Luxury";
      const firstBlogCat =
        taxonomies.find((t) => t.type === "blogCategory")?.name ||
        "Travel Tips";

      setTourFormData((prev) => ({
        ...prev,
        tourType: firstType,
        category: firstCat,
      }));
      setBlogFormData((prev) => ({ ...prev, category: firstBlogCat }));
    }
  }, [taxonomies]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        {/* Top bar (for spacing/branding) */}
        <div className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-12">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
            Control <span className="text-primary italic">Center</span>
          </h2>
          <div className="flex items-center gap-4">
            <Badge variant="primary">Online</Badge>
          </div>
        </div>

        <div className="p-12">
          {/* Header information removed in favor of sidebar context */}
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              {activeTab} Management
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your {activeTab} inventory and resources from here.
            </p>
          </div>

          {/* Packages Section */}
          {activeTab === "packages" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Tour Inventory
                </h2>
                <Badge variant="primary">{tours.length} Active Packages</Badge>
              </div>

              <Card className="p-8 mb-12 border-none shadow-xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <span className="w-2 h-8 bg-primary rounded-full" />
                  {editingTourId
                    ? "Update Existing Package"
                    : "Create New Adventure"}
                </h3>
                <form onSubmit={handleTourSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Package Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={tourFormData.title}
                        onChange={handleTourInputChange}
                        placeholder="e.g. Serengeti Luxury Escape"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={tourFormData.location}
                        onChange={handleTourInputChange}
                        placeholder="e.g. Tanzania"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={tourFormData.price}
                        onChange={handleTourInputChange}
                        placeholder="0.00"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-black text-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Adventure Type
                      </label>
                      <select
                        name="tourType"
                        value={tourFormData.tourType}
                        onChange={handleTourInputChange}
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                      >
                        {taxonomies
                          .filter((t) => t.type === "tourType")
                          .map((ext) => (
                            <option key={ext._id} value={ext.name}>
                              {ext.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Style Category
                      </label>
                      <select
                        name="category"
                        value={tourFormData.category}
                        onChange={handleTourInputChange}
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                      >
                        {taxonomies
                          .filter((t) => t.type === "tourCategory")
                          .map((ext) => (
                            <option key={ext._id} value={ext.name}>
                              {ext.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={tourFormData.duration}
                        onChange={handleTourInputChange}
                        placeholder="e.g. 5 Days"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={tourFormData.image}
                        onChange={handleTourInputChange}
                        placeholder="https://..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="glass-card bg-primary/5 p-8 rounded-2xl border-none">
                    <div className="flex items-center gap-4 mb-6">
                      <input
                        type="checkbox"
                        id="isGroupTour"
                        name="isGroupTour"
                        checked={tourFormData.isGroupTour}
                        onChange={(e) =>
                          setTourFormData({
                            ...tourFormData,
                            isGroupTour: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded accent-primary cursor-pointer"
                      />
                      <label
                        htmlFor="isGroupTour"
                        className="font-black text-gray-900 uppercase text-xs tracking-widest cursor-pointer"
                      >
                        Enable as Group Tour Package
                      </label>
                    </div>

                    {tourFormData.isGroupTour && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                            Max Capacity
                          </label>
                          <input
                            type="number"
                            name="maxCapacity"
                            value={tourFormData.maxCapacity}
                            onChange={handleTourInputChange}
                            className="w-full bg-white p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-primary font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                            Pre-booked
                          </label>
                          <input
                            type="number"
                            name="currentBookings"
                            value={tourFormData.currentBookings}
                            onChange={handleTourInputChange}
                            className="w-full bg-white p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-primary font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                            Launch Date
                          </label>
                          <input
                            type="date"
                            name="launchDate"
                            value={
                              tourFormData.launchDate
                                ? tourFormData.launchDate.split("T")[0]
                                : ""
                            }
                            onChange={handleTourInputChange}
                            className="w-full bg-white p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-primary font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={tourFormData.description}
                      onChange={handleTourInputChange}
                      placeholder="Tell a cinematic story about this tour..."
                      className="w-full bg-gray-50 p-6 rounded-2xl border-none focus:ring-2 focus:ring-primary h-40 font-medium leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-2">
                        Inclusions (One per line)
                      </label>
                      <textarea
                        name="inclusions"
                        value={tourFormData.inclusions}
                        onChange={handleTourInputChange}
                        placeholder="Example:&#10;Professional Guide&#10;Park Fees&#10;Meals"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none h-40 outline-none focus:ring-2 focus:ring-primary font-medium"
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 ml-2">
                        Exclusions (One per line)
                      </label>
                      <textarea
                        name="exclusions"
                        value={tourFormData.exclusions}
                        onChange={handleTourInputChange}
                        placeholder="Example:&#10;International Flights&#10;Tips&#10;Personal Items"
                        className="w-full bg-gray-50 p-4 rounded-xl border-none h-40 outline-none focus:ring-2 focus:ring-primary font-medium"
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black uppercase text-gray-900">
                        Itinerary Days
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setTourFormData({
                            ...tourFormData,
                            itinerary: [
                              ...tourFormData.itinerary,
                              {
                                day: tourFormData.itinerary.length + 1,
                                events: "",
                              },
                            ],
                          })
                        }
                        className="text-primary font-black text-xs uppercase hover:underline"
                      >
                        + Add Day
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tourFormData.itinerary.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-xl border-none space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs text-primary">
                              Day {item.day}
                            </span>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setTourFormData({
                                    ...tourFormData,
                                    itinerary: tourFormData.itinerary.filter(
                                      (_, i) => i !== index,
                                    ),
                                  })
                                }
                                className="text-red-400 text-[10px] font-black uppercase"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <textarea
                            placeholder="Events for this day (One per line)"
                            value={item.events}
                            className="w-full bg-white p-3 rounded-lg border-none text-sm outline-none focus:ring-2 focus:ring-primary h-24"
                            onChange={(e) => {
                              const newItinerary = [...tourFormData.itinerary];
                              newItinerary[index].events = e.target.value;
                              setTourFormData({
                                ...tourFormData,
                                itinerary: newItinerary,
                              });
                            }}
                          ></textarea>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    {editingTourId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingTourId(null);
                          setTourFormData({
                            ...tourFormData,
                            title: "",
                            description: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={loading} className="px-12">
                      {editingTourId ? "Confirm Update" : "Launch Package"}
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((t) => (
                  <Card
                    key={t._id}
                    className="group relative overflow-hidden flex flex-col h-full border-none shadow-lg hover:shadow-2xl"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={t.image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTourId(t._id);
                            setTourFormData({
                              ...t,
                              inclusions: t.inclusions?.join("\n"),
                              exclusions: t.exclusions?.join("\n"),
                              itinerary:
                                t.itinerary?.map((i) => ({
                                  day: i.day,
                                  events: i.events.join("\n"),
                                })) || [],
                            });
                            window.scrollTo(0, 0);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm"
                        >
                          <span className="text-xs font-black uppercase tracking-widest">
                            Edit
                          </span>
                        </button>
                        <button
                          onClick={() => deleteTour(t._id).then(loadTours)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                        >
                          <span className="text-xs font-black uppercase tracking-widest">
                            Delete
                          </span>
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="luxury">{t.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                          {t.tourType}
                        </p>
                        <h4 className="font-black text-xl text-gray-900 mb-2 leading-tight">
                          {t.title}
                        </h4>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {t.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-6 border-t flex justify-between items-center">
                        <p className="font-black text-2xl text-primary">
                          ${t.price}
                        </p>
                        <p className="text-xs font-bold text-gray-400">
                          {t.duration}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Section */}
          {activeTab === "blogs" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Content Hub
                </h2>
                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await generateAiBlog();
                      alert("AI is writing a new blog post...");
                      loadBlogs();
                    } catch (e) {
                      alert("AI Generation failed.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                >
                  🤖 AI Generator
                </Button>
              </div>

              <Card className="p-8 mb-12 border-none shadow-xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <span className="w-2 h-8 bg-secondary rounded-full" />
                  {editingBlogId ? "Refine Story" : "Compose New Story"}
                </h3>
                <form onSubmit={handleBlogSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Story Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={blogFormData.title}
                        onChange={handleBlogInputChange}
                        placeholder="A cinematic title..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-secondary font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={blogFormData.category}
                        onChange={handleBlogInputChange}
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-secondary font-bold uppercase text-xs"
                      >
                        {taxonomies
                          .filter((t) => t.type === "blogCategory")
                          .map((ext) => (
                            <option key={ext._id} value={ext.name}>
                              {ext.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={blogFormData.image}
                      onChange={handleBlogInputChange}
                      placeholder="https://..."
                      className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                      Story Content
                    </label>
                    <textarea
                      name="content"
                      value={blogFormData.content}
                      onChange={handleBlogInputChange}
                      placeholder="Write your epic travel story here..."
                      className="w-full bg-gray-50 p-6 rounded-2xl border-none focus:ring-2 focus:ring-secondary h-64 font-medium leading-relaxed"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4">
                    {editingBlogId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingBlogId(null);
                          setBlogFormData({ title: "", content: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={loading}
                      className="px-12"
                    >
                      {editingBlogId ? "Save Changes" : "Publish Story"}
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((b) => (
                  <Card
                    key={b._id}
                    className="group relative overflow-hidden flex flex-col md:flex-row h-64 border-none shadow-lg hover:shadow-2xl"
                  >
                    <div className="w-full md:w-48 h-full overflow-hidden shrink-0">
                      <img
                        src={b.image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{b.category}</Badge>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingBlogId(b._id);
                                setBlogFormData(b);
                                window.scrollTo(0, 0);
                              }}
                              className="text-blue-500 hover:text-blue-700 transition font-black text-[10px] uppercase"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBlog(b._id).then(loadBlogs)}
                              className="text-red-500 hover:text-red-700 transition font-black text-[10px] uppercase"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <h4 className="font-black text-xl text-gray-900 leading-tight mb-4 line-clamp-2">
                          {b.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black tracking-widest uppercase italic">
                        <span>Published by {b.author || "Admin"}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {activeTab === "bookings" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Reservations
                </h2>
                <Badge variant="accent">{bookings.length} New Bookings</Badge>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((b) => (
                  <Card
                    key={b._id}
                    className="p-8 border-none shadow-md hover:shadow-xl flex flex-col md:flex-row justify-between items-center gap-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-gray-900">
                          {b.name}
                        </h4>
                        <p className="text-gray-500 font-bold mb-1">{b.email}</p>
                        <div className="flex gap-4">
                          <Badge variant="primary" className="text-[10px]">
                            {b.packageTour || b.tourTitle}
                          </Badge>
                          <span className="text-[10px] font-black uppercase text-gray-400">
                            Date:{" "}
                            {new Date(
                              b.bookingDate || b.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-2xl font-black text-gray-900">
                        ${b.totalPrice}
                      </p>
                      <Badge
                        variant={b.status === "confirmed" ? "primary" : "accent"}
                      >
                        {b.status}
                      </Badge>
                      <button
                        onClick={() => deleteBooking(b._id).then(loadBookings)}
                        className="text-[10px] text-red-500 font-black uppercase hover:underline"
                      >
                        Clear Record
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Inquiries Section */}
          {activeTab === "inquiries" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Client Inquiries
                </h2>
                <Badge variant="secondary">{inquiries.length} Messages</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inquiries.map((i) => (
                  <Card key={i._id} className="p-8 border-none shadow-lg group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-xl text-gray-900">
                          {i.name}
                        </h4>
                        <p className="text-primary font-bold text-sm">
                          {i.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="primary">Inquiry</Badge>
                        <button
                          onClick={() => deleteInquiry(i._id).then(loadInquiries)}
                          className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition uppercase font-black"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                      <p className="text-gray-600 italic leading-relaxed">
                        "{i.message}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(i.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        className="py-2 px-6 text-xs"
                        onClick={() =>
                          (window.location.href = `mailto:${i.email}`)
                        }
                      >
                        Reply via Email
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {activeTab === "gallery" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Visual Gallery
                </h2>
                <Badge variant="luxury">{gallery.length} High-Res Assets</Badge>
              </div>

              <Card className="p-8 mb-12 border-none shadow-xl">
                <h3 className="text-xl font-bold mb-8">Add New Asset</h3>
                <form onSubmit={handleGallerySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="location"
                      value={galleryFormData.location}
                      onChange={handleGalleryInputChange}
                      placeholder="Location"
                      className="bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                      required
                    />
                    <input
                      type="text"
                      name="caption"
                      value={galleryFormData.caption}
                      onChange={handleGalleryInputChange}
                      placeholder="Caption"
                      className="bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold md:col-span-2"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="img"
                      value={galleryFormData.img}
                      onChange={handleGalleryInputChange}
                      placeholder="Image URL"
                      className="flex-1 bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <Button type="submit" disabled={loading} className="px-10">
                      Upload Asset
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g._id}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                    <img
                      src={g.img}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 text-center">
                      <p className="text-white font-black text-xs uppercase mb-1">
                        {g.location}
                      </p>
                      <p className="text-white/70 text-[10px] mb-4">
                        {g.caption}
                      </p>
                      <button
                        onClick={() => deleteGallery(g._id).then(loadGallery)}
                        className="bg-red-500 text-white p-2 rounded-lg text-[10px] font-black uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters Section */}
          {activeTab === "filters" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Taxonomy & Filters
                </h2>
                <Badge variant="primary">{taxonomies.length} Dynamic Tags</Badge>
              </div>

              <Card className="p-8 mb-12 border-none shadow-xl">
                <h3 className="text-xl font-bold mb-8 italic">
                  New Classification
                </h3>
                <form
                  onSubmit={handleTaxSubmit}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <input
                    type="text"
                    name="name"
                    value={taxFormData.name}
                    onChange={(e) =>
                      setTaxFormData({ ...taxFormData, name: e.target.value })
                    }
                    placeholder="Filter Name (e.g. Eco-Luxury)"
                    className="flex-1 bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                    required
                  />
                  <select
                    name="type"
                    value={taxFormData.type}
                    onChange={(e) =>
                      setTaxFormData({ ...taxFormData, type: e.target.value })
                    }
                    className="bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-black uppercase text-xs"
                  >
                    <option value="tourType">Adventure Type</option>
                    <option value="tourCategory">Tour Category</option>
                    <option value="blogCategory">Blog Category</option>
                  </select>
                  <Button type="submit" disabled={loading} className="px-10">
                    Create Filter
                  </Button>
                </form>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["tourType", "tourCategory", "blogCategory"].map((type) => (
                  <Card key={type} className="p-6 border-none shadow-md bg-white">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 border-b pb-2">
                      {type === "tourType"
                        ? "Adventure Types"
                        : type === "tourCategory"
                          ? "Tour Categories"
                          : "Blog Categories"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {taxonomies
                        .filter((t) => t.type === type)
                        .map((tax) => (
                          <div
                            key={tax._id}
                            className="flex items-center gap-2 bg-gray-50 pl-4 pr-2 py-2 rounded-full border border-gray-100 group hover:border-red-200 transition"
                          >
                            <span className="text-xs font-bold text-gray-700">
                              {tax.name}
                            </span>
                            <button
                              onClick={() =>
                                deleteTaxonomy(tax._id).then(loadTaxonomies)
                              }
                              className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 group-hover:bg-red-500 group-hover:text-white flex items-center justify-center text-[10px]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
