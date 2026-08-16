import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    heroImage: { type: String, required: true },
    shortIntro: { type: String, required: true },
    description: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    wildlifeCalendar: [{ month: { type: String }, event: { type: String } }],
    highlights: [{ type: String }],
    gallery: [{ type: String }],
    location: { type: String },
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
