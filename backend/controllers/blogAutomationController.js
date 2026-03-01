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
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const systemInstruction = `
            Act as a Tanzanian Travel Journalist and expert blogger for "Makolo Adventure Tours". 
            Write a professional, engaging, and SEO-friendly blog post about a current trend, seasonal event, or expert travel tip regarding tourism in Tanzania.

            Your response MUST be a raw JSON object string ONLY (no markdown backticks) with this structure:
            {
                "title": "...",
                "category": "Safari News" | "Trekking Tips" | "Beach Living" | "Cultural Insights",
                "content": "...",
                "imageKeyword": "Serengeti" | "Kilimanjaro" | "Zanzibar" | "Ngorongoro" | "Wildlife" | "Culture"
            }
        `;

        const contents = [{ role: 'user', parts: [{ text: "Gather today's most interesting Tanzanian tourism news or advice and write a detailed blog post." }] }];

        let response;
        const modelsToTry = ["gemini-3-flash-preview", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-pro"];
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                console.log(`AI Blogger: Attempting generation with ${modelName}...`);
                response = await ai.models.generateContent({
                    model: modelName,
                    contents: contents,
                    config: {
                        systemInstruction: systemInstruction,
                        maxOutputTokens: 2500,
                        temperature: 0.7
                    }
                });
                if (response && response.text) break;
            } catch (err) {
                console.warn(`AI Blogger: ${modelName} failed:`, err.message);
                lastError = err;
                continue;
            }
        }

        if (!response || !response.text) {
            throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
        }

        const responseText = response.text;

        // Improved JSON extraction
        let jsonStr = responseText.trim();
        if (jsonStr.includes("```")) {
            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
        }

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
