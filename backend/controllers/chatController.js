import { GoogleGenAI } from "@google/genai";
import TourPackage from "../models/TourPackage.js";
import Blog from "../models/Blog.js";

export const handleChat = async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        // Fetch context data
        const tours = await TourPackage.find({}).select('title location price duration description tourType category');
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3).select('title category');

        const companyContext = `
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

        // Format history for the new SDK
        const contents = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        }));

        // Add the current message
        contents.push({ role: 'user', parts: [{ text: message }] });

        let response;
        try {
            // Try the latest Gemini 3 model first
            response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: contents,
                config: {
                    systemInstruction: companyContext,
                    maxOutputTokens: 800,
                }
            });
        } catch (innerError) {
            console.warn("Gemini 3 Failed, trying fallback...", innerError.message);
            // Fallback to Gemini 1.5 Flash if 3.0 is unavailable or at quota
            response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: contents,
                config: {
                    systemInstruction: companyContext,
                    maxOutputTokens: 800,
                }
            });
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
