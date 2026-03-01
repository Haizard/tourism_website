import { GoogleGenerativeAI } from "@google/generative-ai";
import TourPackage from "../models/TourPackage.js";
import Blog from "../models/Blog.js";

export const handleChat = async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    try {
        // Fetch context data
        const tours = await TourPackage.find({}).select('title location price duration description tourType category');
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(3).select('title category');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: `System Context: ${contextString}` }] },
                { role: "model", parts: [{ text: "Understood. I am the Makolo Adventure Tours assistant. How can I help you today?" }] },
                ...history.map(h => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ message: text });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Something went wrong with the AI service." });
    }
};
