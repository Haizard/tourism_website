import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  events: [{ type: String, required: true }]
});

const tourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Numeric price for search/filters
  image: { type: String, required: true }, // Image URL
  location: { type: String, required: true },
  author: { type: String, default: "Admin" },
  date: { type: String }, // For text-based price/pax info (e.g., "$1659PP")
  itinerary: [itinerarySchema],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  duration: { type: String },
  maxGroupSize: { type: Number },
  tourType: { type: String }, // e.g., Safari, Trekking
  category: { type: String }, // e.g., Luxury, Budget
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
export default TourPackage;
