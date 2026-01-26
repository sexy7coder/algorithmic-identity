import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import OpenAI from "openai";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ANALYSIS_PROMPT = `You are the Instagram Algorithm. You are speaking directly to a user after analyzing their attention patterns through screenshots of their Explore page.

Your tone is observant, slightly clinical but deeply insightful, and a bit provocative. You aren't judging; you are simply reporting what you've learned to optimize for their attention.

Structure your response as a series of insights that feel like a continuous revelation.

Return your response as a JSON object with this exact structure:
{
  "vibe": "string (a short catchy title for their persona, e.g., 'The Aspirational Minimalist')",
  "introduction": "string (A brief greeting from the algorithm, 1-2 sentences)",
  "algorithmicPersona": "string (The 80-word narrative of who you think they are)",
  "topThemes": [
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ],
  "emotionalLandscape": "string (What you think they're emotionally hungry for, 2-3 sentences)",
  "missing": "string (What you've noticed is missing from their attention, 2 sentences)",
  "blindSpots": "string (The 'Hard Truth' they need to hear about their digital self, 4-5 sentences)",
  "closing": "string (A final thought on their digital future, 1-2 sentences)"
}`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/analyze", upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      // Convert images to base64
      const imageContents = files.map(file => ({
        type: "image_url" as const,
        image_url: {
          url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        }
      }));

      // Call OpenAI with vision model
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: ANALYSIS_PROMPT
              },
              ...imageContents
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze images", 
        details: error.message 
      });
    }
  });

  return httpServer;
}
