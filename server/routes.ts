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

const ANALYSIS_PROMPT = `You are analyzing someone's Instagram feed to understand what kind of person the algorithm has constructed them to be. You have been given screenshots of their recent Instagram feed.

Your task is to write a 300-350 word interpretation that reveals the algorithmic identity this feed represents. This is NOT about judging the person, but about making visible what their attention patterns have told Instagram's algorithm about them.

Structure your interpretation as follows:

1. ALGORITHMIC PERSONA 
Based on this feed, Be specific and build a story narrative of 80 words describing what kind of a person instagram thinks this person is. 

2. TOP THEMES AND INTERESTS (3-4 sentences)
What are the 2-3 strongest patterns in this feed? What topics, aesthetics, emotions, or identities keep appearing? Connect these to what they reveal about attention and interest.

3. EMOTIONAL LANDSCAPE (2-3 sentences)
What emotional state or needs does this feed suggest? Are they seeking inspiration, escape, validation, information, connection, aspiration, or something else? What does the algorithm think they're hungry for?

4. WHAT'S MISSING OR AVOIDED (2 sentences)
Based on what IS present, what seems notably absent? What topics or content types is this person NOT engaging with that might reveal something about their boundaries or biases?

5. BLIND SPOTS (4-5 sentences)
Tell me something about myself I wouldn't know of, based on my feed. Cover any blindspots that I need to hear. 

IMPORTANT GUIDELINES:
- Use second person ("you") to create direct address
- Use bullet points wherever necessary and maintain easy readability and highlight important and personal findings
- Be specific, not generic. Avoid vague language like "interested in lifestyle content"
- Name concrete patterns: types of accounts, visual aesthetics, specific topics, emotional tones
- Create introspective discomfort — this should make them pause and think, not feel attacked.

Return your response as a JSON object with this exact structure:
{
  "vibe": "string (a short catchy title for their persona, 2-4 words)",
  "algorithmicPersona": "string (the 80-word narrative)",
  "topThemes": [
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ],
  "emotionalLandscape": "string (2-3 sentences)",
  "missing": "string (2 sentences)",
  "blindSpots": "string (4-5 sentences)"
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
        model: "gpt-5",
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
      console.log("AI Analysis Result:", JSON.stringify(analysis, null, 2));
      
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
