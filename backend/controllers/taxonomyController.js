import Taxonomy from '../models/Taxonomy.js';

export const getTaxonomies = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const taxonomies = await Taxonomy.find(filter).sort({ name: 1 });
        res.status(200).json(taxonomies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTaxonomy = async (req, res) => {
    try {
        const taxonomy = new Taxonomy(req.body);
        await taxonomy.save();
        res.status(201).json(taxonomy);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTaxonomy = async (req, res) => {
    try {
        const { id } = req.params;
        await Taxonomy.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
