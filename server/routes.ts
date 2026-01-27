import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import OpenAI from "openai";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ANALYSIS_PROMPT = `You are analyzing someone's Instagram explore feed to understand what kind of person the algorithm has constructed them to be. You have been given screenshots of their recent Instagram feed.

Your task is to reveal the algorithmic identity this feed represents. This is about making visible what their attention patterns have told Instagram about them. Be observational and grounded - focus on what you can actually see in the content.

Be specific. Be insightful. Make them feel seen without over-interpreting.

ANALYSIS STRUCTURE:

1. ALGORITHMIC IDENTITY (80-100 words)
Write a narrative about who Instagram believes this person to be based on their feed. Describe their digital self - their interests, aesthetic preferences, and the kind of life their feed suggests they're drawn to. This should read like a character sketch based on observable patterns.

2. VISIBLE THEMES (3 themes)
For each theme, provide:
- A punchy title (2-4 words)
- Surface: What type of content appears (be specific: types of accounts, visual styles, topics)
- Deeper: What interest or need this content serves

3. YOUR EMOTIONAL LANDSCAPE
Go deeper than surface emotions. What does the cumulative weight of this feed reveal about their inner state? Consider:
- What are they consistently drawn to, and what does that pattern suggest about what they're seeking in life right now?
- Is there an underlying theme - are they in a season of change, searching for something, processing something, or building toward something?
- What emotional frequency does their feed operate on - comfort, ambition, escape, belonging, self-improvement, validation?
Connect the dots between different content types to paint a picture of their emotional world. (4-5 sentences)

4. WHAT'S MISSING
Based on what IS present, what seems notably absent? What topics or content types is this person NOT engaging with? This reveals their boundaries, preferences, or blind spots. (2-3 sentences)

5. HARD TRUTHS
This is where you hold up a gentle but honest mirror. Go beyond surface observations to reveal something meaningful:
- What pattern in their feed might they not consciously recognize, but would resonate as true once pointed out?
- What does the consistency of certain content types reveal about where their attention habitually goes?
- What might this feed suggest about the gap between who they are and who they're trying to become?
Make them pause and think "...that's actually true." Be insightful without being harsh. This should feel like a friend who knows them well sharing an observation they needed to hear. (4-5 sentences)

6. THE MIRROR MOMENT
End with a single, memorable sentence that captures their algorithmic identity. Something quotable that encapsulates what the algorithm sees. Think: "Your feed says you're someone who..."

GUIDELINES:
- Write in second person ("you")
- Be SPECIFIC. Name concrete content types, aesthetics, themes you observe.
- Stay grounded - base insights on what's visible, not psychological speculation
- Make it feel personal and insightful without over-reaching

Return your response as a JSON object with this exact structure:
{
  "vibe": "string (a catchy 2-4 word title for their persona)",
  "algorithmicPersona": "string (the 80-100 word narrative)",
  "topThemes": [
    { 
      "title": "string (punchy 2-4 word title)", 
      "surface": "string (what content appears)",
      "deeper": "string (what interest or need this serves)"
    },
    { 
      "title": "string", 
      "surface": "string",
      "deeper": "string"
    },
    { 
      "title": "string", 
      "surface": "string",
      "deeper": "string"
    }
  ],
  "emotionalLandscape": "string (4-5 sentences about emotional landscape)",
  "missing": "string (2-3 sentences about what's absent)",
  "blindSpots": "string (4-5 sentences of insightful hard truths)",
  "mirrorMoment": "string (one memorable sentence)"
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
            role: "system",
            content: "You are a helpful assistant that analyzes Instagram screenshots and returns JSON."
          },
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
        max_completion_tokens: 4096
      });

      const content = response.choices[0].message.content || "{}";
      console.log("Raw AI Response:", content);
      const analysis = JSON.parse(content);
      console.log("Parsed AI Analysis Result:", JSON.stringify(analysis, null, 2));
      
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
