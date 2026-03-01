import { GoogleGenAI } from "@google/genai";
import TourPackage from "../models/TourPackage.js";
import Blog from "../models/Blog.js";

// The client can get the API key from process.env.GEMINI_API_KEY automatically
// if we pass an empty config, but we'll be explicit to be safe.

export const handleChat = async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            apiVersion: "v1"
        });

        // Fetch context data
        const tours = await TourPackage.find({}).select('title location price duration description tourType category');
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3).select('title category');

        const contextString = `
            You are a helpful and persuasive travel assistant for "Makolo Adventure Tours", a premier tourism company in Tanzania.
            Your goal is to assist customers, answer questions about Tanzania travel, and convincingly encourage them to book our packages.
            
            Our Current Packages:
            ${tours.map(t => `- ${t.title} in ${t.location}: ${t.duration}, $${t.price}. (${t.tourType}, ${t.category}) - ${t.description}`).join('\n')}

            Latest News/Blogs:
            ${blogs.map(b => `- ${b.title} (${b.category})`).join('\n')}

            Company Tone: Professional, enthusiastic, knowledgeable, and inviting.
            Rules:
            1. If a user asks about pricing, be specific using the data above.
            2. If a user is undecided, highlight the unique experiences of our tours.
            3. Keep responses concise and engaging.
            4. If asked about booking, direct them to our website's booking buttons.
        `;

        // The new SDK uses a different history format or we can use generateContent with a system instruction
        // We'll use the generateContent method which is simple and direct based on the quickstart.

        const contents = [
            { role: "user", parts: [{ text: `System Context: ${contextString}` }] },
            { role: "model", parts: [{ text: "Understood. I am the Makolo Adventure Tours assistant. How can I help you today?" }] },
            ...history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            })),
            { role: "user", parts: [{ text: message }] }
        ];

        let response;
        try {
            // Try the state-of-the-art model first
            response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: contents,
                config: {
                    maxOutputTokens: 800,
                }
            });
        } catch (innerError) {
            // Fallback to 1.5-flash if 2.0 is at quota or unavailable
            if (innerError.status === 429 || innerError.message?.includes("quota")) {
                console.log("Gemini 2.0 Quota exceeded, falling back to 1.5-flash...");
                response = await ai.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: contents,
                    config: {
                        maxOutputTokens: 800,
                    }
                });
            } else {
                throw innerError;
            }
        }

        res.json({ message: response.text });
    } catch (error) {
        console.error("Chat Error:", error);
        if (error.status === 429) {
            return res.status(429).json({
                error: "Our AI assistant is temporarily resting due to high demand. Please try again in a minute or reach out to us on WhatsApp!"
            });
        }
        res.status(500).json({ error: "Something went wrong with the AI service. Please try our WhatsApp support!" });
    }
};
