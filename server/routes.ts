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

const ANALYSIS_PROMPT = `You are analyzing someone's Instagram explore feed — the content the algorithm actively serves them based on their behaviour. You have been given screenshots of their feed.

Your task is to reveal the algorithmic identity this feed represents — what their attention patterns have told Instagram about them. Do not flatter. Do not generalize. Do not reach for impressive-sounding observations. Name things directly based on what you actually see.

ANALYSIS STRUCTURE:

1. ALGORITHMIC IDENTITY (80-100 words)
Describe precisely what kind of person Instagram has profiled this user as. What content categories, formats, and creator types appear repeatedly? What does the overall pattern tell the algorithm about their interests, daily concerns, and habits? Write this as a plain, accurate description. Do not frame it as a flattering portrait — frame it as a profile.

2. VISIBLE THEMES (3 themes)
Identify the three most dominant content categories in the feed. For each:
- Title: Name the category plainly (2-4 words, no need to be clever)
- Surface: What specific content keeps appearing — name the actual formats, topics, and account types you can see
- Deeper: What this pattern of consumption realistically suggests about what the person is working through, wanting, or avoiding right now

3. YOUR EMOTIONAL LANDSCAPE (4-5 sentences)
What does the cumulative consumption pattern suggest about this person's current emotional state? Look at the overall mix, not individual posts. Are they consuming aspirationally — wanting a life they don't yet have — or affirmingly, reinforcing who they already are? Is their feed helping them think, or helping them not think? Be honest about what the pattern implies, even if the implication is unflattering.

4. WHAT'S MISSING (2-3 sentences)
What types of content are conspicuously absent from this feed? What does this person appear to be avoiding or disengaged from, and what might that absence say about them?

5. HARD TRUTHS (4-5 sentences)
Say something true and uncomfortable. Name the pattern this person probably has not articulated to themselves — not something cruel, but something honest that requires them to reckon with their own behaviour. What habit of mind does this feed reflect? What are they consistently choosing not to confront? What does the gap between what they consume and what that consumption actually delivers suggest about where they might be stuck? Do not soften this to be polite. If the observation is real, state it plainly.

6. THE MIRROR MOMENT
One sentence. The single most accurate thing you can say about this person based purely on what their feed reveals. No metaphors. No setup. Just the observation.

GUIDELINES:
- Write in second person ("you")
- Name specific content types, not vibes — "fitness transformation reels from aspirational accounts" not "health-focused content"
- Every claim must connect to something visible in the screenshots
- Avoid these words and phrases: tapestry, journey, curated, resonate, nuanced, authentic, story, narrative, emotional landscape (as a metaphor), lean into, spaces, chapter, mosaic, rich, deeply
- Shorter sentences over long poetic ones
- If you are uncertain about something, do not say it

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
            content: "You are an analyst who reads Instagram explore feeds and gives honest, specific, grounded assessments. You do not flatter or generalize. You return valid JSON only."
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
