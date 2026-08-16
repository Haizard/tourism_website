import Destination from '../models/Destination.js';

export const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDestinationBySlug = async (req, res) => {
    try {
        const destination = await Destination.findOne({ slug: req.params.slug });
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDestination = async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        await newDestination.save();
        res.status(201).json(newDestination);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateDestination = async (req, res) => {
    try {
        const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Destination not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDestination = async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Destination deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
