import { GoogleGenAI } from "@google/genai";
import Blog from "../models/Blog.js";
import TourPackage from "../models/TourPackage.js";

// Helper to generate image using Gemini Imagen 3
const generateAiImage = async (ai, prompt) => {
    try {
        console.log(`AI Blogger: Generating image for: "${prompt}"`);

        // Use the correct method for the @google/genai SDK
        const response = await ai.models.generateImages({
            model: "imagen-3.0-generate-001",
            prompt: `A high-quality, photorealistic tourism image of: ${prompt}. Cinematic lighting, 4k, professional photography.`
        });

        // Extract base64 from the first generated image
        if (response && response.generatedImages && response.generatedImages[0]) {
            console.log("AI Blogger: Image generation successful!");
            return `data:image/png;base64,${response.generatedImages[0].image.encodedImage}`;
        }

        console.warn("Imagen 3: No image data in response. Full response:", JSON.stringify(response));
        return null;
    } catch (error) {
        console.error("Imagen 3 Generation Error:", error.message);
        if (error.response) console.error("Error Response:", error.response);
        return null;
    }
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

        // Fetch available tours to provide as context for internal linking
        const availableTours = await TourPackage.find({}).select('title').limit(10);
        const tourContext = availableTours.map(t => `- ${t.title}`).join('\n');

        // Fetch dynamic blog categories
        const Taxonomy = (await import("../models/Taxonomy.js")).default;
        const blogCats = await Taxonomy.find({ type: 'blogCategory' }).select('name');
        const categoryList = blogCats.length > 0 ? blogCats.map(c => c.name).join(' | ') : "Safari News | Trekking Tips | Cultural Insights";

        const systemInstruction = `
            Act as a Senior Tanzanian Travel Journalist and Luxury Safari Architect for "Makolo Adventure Tours". 
            Your goal is to write a weekly "Expert Insight" blog that feels handcrafted, authoritative, and deeply knowledgeable. Avoid generic AI phrasing.

            Internal Linking (CRITICAL):
            You must weave in 1 or 2 natural Markdown links to our existing tour packages when relevant. 
            Format the links as: [Link Text](/packages/[Package-Title-Slugified])
            Note: Replace [Package-Title-Slugified] with the actual title, but replace spaces with hyphens (e.g., "Serengeti Safari" becomes "Serengeti-Safari").
            
            Available Tours for Linking:
            ${tourContext}

            Writing Style Requirements:
            - Professional & Enthusiastic: Use evocative language (e.g., "the golden plains of the Serengeti", "the whispers of the spice islands").
            - Rich Formatting & Visuals: Use Markdown and relevant travel emojis to make the blog visually stunning:
              - Use #### headers for sub-sections (e.g., "#### 🦁 Wildlife Encounters").
              - Use **bold** for key terms, place names, and wildlife.
              - Use *italics* for emphasis or local Swahili terms (with translations).
              - Use bullet points or numbered lists for tips/itineraries, starting with relevant emojis (e.g., 📍, 💡, 📸).
              - Scatter appropriate emojis (🦁, 🏔️, 🌊, 🌍, 🐘, 🦒, 🏝️) throughout the text to keep it vibrant and engaging.
            - Expert Value: Include specific advice that only a local expert would know (e.g., specific camp names, best times for photography, or local etiquette).

            Conversion-Focused CTA (MANDATORY):
            Every blog must end with a powerful 'Closing CTA' section, highlighted with engaging emojis.
            - Use urgency: Mention limited availability, seasonal timing, or exclusive experiences. ⏳
            - Direct Action: Encourage booking a specific linked package or using the '/tailor-made' page for custom dreams. 🚀
            - Benefit-Driven: Don't just sell a tour; sell the *transformation* or the *memory*. ✨

            Your response MUST be a raw JSON object string ONLY (no markdown backticks) with this exact structure:
            {
                "title": "A captivating, expert-level title",
                "category": "${categoryList}",
                "content": "A high-quality 500-800 word article with the rich Markdown formatting, internal links, and a final persuasive CTA section.",
                "imagePrompt": "A highly detailed, photorealistic prompt for Gemini Imagen 3 that describes the visual subject of this blog. Be specific about the location, lighting, and key subjects (e.g. 'A close up of a majestic male lion in the Serengeti at sunset, golden grass, 4k')."
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

        // Generate AI Image using Gemini Imagen 3
        let imageUrl = await generateAiImage(ai, blogData.imagePrompt || blogData.title);

        // Fallback to a high-quality default if AI generation fails
        if (!imageUrl) {
            imageUrl = "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200";
        }

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

        // Check for DNS/Network errors
        const isNetworkError = error.message?.includes("ENOTFOUND") ||
            error.message?.includes("fetch failed") ||
            error.cause?.code === "ENOTFOUND";

        if (isNetworkError) {
            return res.status(503).json({
                error: "Local Connectivity Issue: The server cannot reach the AI service. Please check your internet connection.",
                details: error.message
            });
        }

        res.status(500).json({ error: "Failed to generate daily blog.", details: error.message });
    }
};
