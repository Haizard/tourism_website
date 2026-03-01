import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({ baseURL: API_URL });

// Tour Packages
export const fetchTours = (params = "") => API.get(`/tours${params}`);
export const fetchTour = (id) => API.get(`/tours/${id}`);
export const createTour = (newTour) => API.post("/tours", newTour);
export const updateTour = (id, updatedTour) => API.put(`/tours/${id}`, updatedTour);
export const deleteTour = (id) => API.delete(`/tours/${id}`);

// Gallery
export const fetchGallery = () => API.get("/gallery");
export const createGallery = (newItem) => API.post("/gallery", newItem);
export const deleteGallery = (id) => API.delete(`/gallery/${id}`);

// Bookings
export const fetchBookings = () => API.get("/bookings");
export const createBooking = (newBooking) => API.post("/bookings", newBooking);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Blogs
export const fetchBlogs = () => API.get("/blogs");
export const fetchBlog = (id) => API.get(`/blogs/${id}`);
export const createBlog = (newBlog) => API.post("/blogs", newBlog);
export const updateBlog = (id, updatedBlog) => API.put(`/blogs/${id}`, updatedBlog);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export default API;
