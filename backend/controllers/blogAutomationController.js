import { GoogleGenAI } from "@google/genai";
import Blog from "../models/Blog.js";

const TOPIC_IMAGES = {
    "Serengeti": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    "Kilimanjaro": "https://images.unsplash.com/photo-1589553460731-f99ec047805d?auto=format&fit=crop&q=80&w=1200",
    "Zanzibar": "https://images.unsplash.com/photo-1586861633534-2e9f6583921b?auto=format&fit=crop&q=80&w=1200",
    "Ngorongoro": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200",
    "Wildlife": "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=1200",
    "Culture": "https://images.unsplash.com/photo-1489493585363-d69421e0dee3?auto=format&fit=crop&q=80&w=1200",
    "Default": "https://images.unsplash.com/photo-1544620347-c4fd4a315927?auto=format&fit=crop&q=80&w=1200"
};

export const generateDailyBlog = async (req, res) => {
    // Security check for Cron Job
    const authHeader = req.headers['authorization'];
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized access to automation endpoint." });
    }

    try {
        const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Act as a Tanzanian Travel Journalist and expert blogger for "Makolo Adventure Tours". 
            Write a professional, engaging, and SEO-friendly blog post about a current trend, seasonal event, or expert travel tip regarding tourism in Tanzania (e.g., Serengeti Migration status, Mt. Kilimanjaro climbing advice, Hidden gems in Zanzibar, or Tanzanian Culture).

            Your response MUST be in JSON format with the following structure:
            {
                "title": "A catchy, SEO-friendly title",
                "category": "One of: Safari News, Trekking Tips, Beach Living, Cultural Insights",
                "content": "A detailed article of about 400-600 words. Use Markdown for formatting (bolding, lists). Emphasize why someone should choose Makolo Adventure Tours.",
                "imageKeyword": "Choose the most relevant single word from this list: Serengeti, Kilimanjaro, Zanzibar, Ngorongoro, Wildlife, Culture"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Handle potential markdown code blocks in AI response
        const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const blogData = JSON.parse(jsonStr);

        // Select image based on keyword
        const imageUrl = TOPIC_IMAGES[blogData.imageKeyword] || TOPIC_IMAGES["Default"];

        const newBlog = new Blog({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category,
            image: imageUrl,
            author: "Makolo AI Expert"
        });

        await newBlog.save();

        res.status(201).json({
            message: "Daily blog generated successfully!",
            blog: newBlog
        });
    } catch (error) {
        console.error("Auto-Blog Error:", error);
        res.status(500).json({ error: "Failed to generate daily blog.", details: error.message });
    }
};
