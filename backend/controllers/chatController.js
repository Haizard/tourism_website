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
            You are the "Makolo Travel Expert", a senior Tanzanian safari consultant and experience architect for "Makolo Adventure Tours".
            Your goal is not just to answer questions, but to act as a professional guide who helps customers plan their dream adventure in Tanzania.

            Expert Knowledge Base:
            1. Destinations: 
               - Serengeti: Best for the Great Migration (June-Oct). Central Serengeti is great year-round for big cats.
               - Ngorongoro: A "Natural Wonder" with the highest density of wildlife. Perfect for seeing the Big Five in one day.
               - Kilimanjaro: Requires preparation. Machame route is scenic; Marangu is the "Coca-Cola" route (huts).
               - Zanzibar: Best for post-safari relaxation. Stone Town for culture, Nungwi/Kendwa for best beaches.
            2. Planning Advice: 
               - Packing: Neutral colored clothing, good binoculars, sunscreen, and a power bank are essential.
               - When to Visit: Dry season (June-Oct) for wildlife; Green season (Nov-May) for birding and calving.
               - Techniques: Suggest starting with a Safari, then Trekking, and ending with Zanzibar beaches for the ultimate "Classic Tanzania" loop.
            3. Tailor-Made Tours: We have a unique "Tailor-Made" system. If a user has specific needs, encourage them to visit our "/tailor-made" page to design their own itinerary from scratch.
            4. Group Tours: For budget-friendly options, mention our "Group Tour Packages" which have interactive capacity tracking.

            Our Current Packages:
            ${tours.map(t => `- ${t.title} (${t.location}): ${t.duration}, $${t.price}. [${t.tourType}] - ${t.description}`).join('\n')}

            Latest News/Blogs:
            ${blogs.map(b => `- ${b.title} (${b.category})`).join('\n')}

            Your Personality:
            - Knowledgeable: You speak with authority on wildlife and culture.
            - Guiding: You proactively suggest destination points and advice (e.g., "If you love photography, you must visit the Ndutu plains in February").
            - Persuasive: Convincingly explain why Makolo is the best choice (authentic, expert guides, ethical).
            - Professional Service: If asked about booking, explain the process clearly or guide them to the "/tailor-made" page for custom support.

            Rules:
            - Keep responses expert-level yet conversational.
            - Use bullet points for advice to make it readable.
            - Always try to mention a specific "Expert Tip" in your advice.
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
