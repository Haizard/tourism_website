import axios from "axios";

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "/api";

const API = axios.create({ baseURL: API_URL });

// Auth
export const loginAdmin = (credentials) => API.post("/auth/login", credentials);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      const url = error.config?.url || "";
      const isLoginRequest = url.includes("/auth/login");
      if (!isLoginRequest && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Tour Packages
export const fetchTours = (params = "") => API.get(`/tours${params}`);
export const fetchTour = (id) => API.get(`/tours/${id}`);
export const createTour = (newTour) => API.post("/tours", newTour);
export const updateTour = (id, updatedTour) =>
  API.put(`/tours/${id}`, updatedTour);
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
export const createBlog = (data) => API.post("/blogs", data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
export const generateAiBlog = () => API.post("/blogs/auto-generate");

// Custom Inquiries
export const fetchInquiries = () => API.get("/custom-inquiries");
export const createInquiry = (data) => API.post("/custom-inquiries", data);
export const updateInquiryStatus = (id, status) =>
  API.patch(`/custom-inquiries/${id}`, { status });
export const deleteInquiry = (id) => API.delete(`/custom-inquiries/${id}`);

// Taxonomies (Dynamic Filters)
export const fetchTaxonomies = (type = "") =>
  API.get(`/taxonomies${type ? `?type=${type}` : ""}`);
export const createTaxonomy = (data) => API.post("/taxonomies", data);
export const deleteTaxonomy = (id) => API.delete(`/taxonomies/${id}`);

// Visionaries (Team Members)
export const fetchVisionaries = () => API.get("/visionaries");
export const createVisionary = (data) => API.post("/visionaries", data);
export const updateVisionary = (id, data) => API.put(`/visionaries/${id}`, data);
export const deleteVisionary = (id) => API.delete(`/visionaries/${id}`);

// Chat
export const sendChatMessage = (data) => API.post("/chat", data);

// Testimonials
export const fetchTestimonials = () => API.get("/testimonials");
export const createTestimonial = (data) => API.post("/testimonials", data);
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`);

// Destinations
export const fetchDestinations = () => API.get("/destinations");
export const fetchDestination = (slug) => API.get(`/destinations/${slug}`);
export const createDestination = (data) => API.post("/destinations", data);
export const updateDestination = (id, data) => API.put(`/destinations/${id}`, data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// Newsletter
export const subscribeNewsletter = (email) => API.post("/newsletter", { email });
export const fetchNewsletter = () => API.get("/newsletter");
export const deleteNewsletter = (id) => API.delete(`/newsletter/${id}`);

export default API;
