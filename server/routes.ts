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

const ANALYSIS_PROMPT = `You are a digital psychologist analyzing someone's Instagram explore feed to reveal their deepest algorithmic identity. You have been given screenshots of their recent Instagram feed.

Your role is to go DEEP. This isn't surface-level content analysis — you're uncovering the psychological architecture that the algorithm has built around this person. You're making visible what their attention patterns, pauses, and preferences have told Instagram about their inner world.

Be bold. Be specific. Be uncomfortably accurate. This should feel like looking in a mirror they didn't know existed.

ANALYSIS STRUCTURE:

1. THE ALGORITHMIC PERSONA (100 words)
Write a vivid narrative about who Instagram believes this person to be. Paint a picture of their digital self — their aspirations, insecurities, obsessions, and the life they're quietly building in their mind through their feed. This should read like a character study, not a list.

2. CORE IDENTITY PATTERNS (3 themes)
For each theme, provide:
- A punchy title (2-4 words)
- The surface pattern: What type of content appears (be specific: aesthetics, accounts, topics)
- The deeper meaning: What psychological need or identity this serves
- The uncomfortable truth: What this reveals about them that they might not consciously acknowledge

3. THE SECRET SELF
What is this person drawn to that they might not openly admit? What guilty pleasures, hidden aspirations, or suppressed interests does the algorithm see that their friends might not? Be specific and insightful.

4. EMOTIONAL HUNGER
What is this person really starving for? Go beyond simple emotions. Are they seeking validation for a life change? Escape from something they won't name? Permission to be someone different? Information that makes them feel in control? Connection they're not getting offline? Be specific about the emotional void this feed is trying to fill.

5. THE DIGITAL CONTRADICTION
Where does this feed contradict itself? What tensions exist between different content types? For example: minimalism content alongside luxury shopping, fitness content alongside comfort food, career hustle alongside escapism. What internal conflict does this reveal?

6. THE SHADOW (What's Conspicuously Absent)
What's missing from this feed reveals as much as what's present. What topics, perspectives, or types of content is this person systematically avoiding? What might this avoidance protect them from confronting?

7. HARD TRUTHS (Blind Spots)
This is where you hold up the mirror. Tell them something about themselves they probably don't want to hear but need to. Be direct but not cruel. This should create a moment of genuine self-reflection. Cover:
- A pattern they're probably not aware of
- What their feed says about their relationship with themselves
- A question they should ask themselves

8. THE MIRROR MOMENT
End with a single, powerful sentence that encapsulates their entire algorithmic identity. This should be quotable, memorable, and make them pause. Think: "The algorithm knows you're looking for permission to..."

CRITICAL GUIDELINES:
- Write in second person ("you") to create direct, personal impact
- Be SPECIFIC. Name exact types of content, aesthetics, themes. Never be vague.
- Create introspective discomfort — this should make them think, not feel attacked
- Avoid generic observations anyone could make. Every insight should feel personally seen.
- Balance depth with readability. Use vivid language.
- This should feel like a therapy session, not a marketing report.

Return your response as a JSON object with this exact structure:
{
  "vibe": "string (a provocative 2-4 word title for their digital persona)",
  "algorithmicPersona": "string (the 100-word narrative character study)",
  "topThemes": [
    { 
      "title": "string (punchy 2-4 word title)", 
      "surface": "string (what content appears)",
      "deeper": "string (psychological need this serves)",
      "truth": "string (uncomfortable revelation)"
    },
    { 
      "title": "string", 
      "surface": "string",
      "deeper": "string",
      "truth": "string"
    },
    { 
      "title": "string", 
      "surface": "string",
      "deeper": "string",
      "truth": "string"
    }
  ],
  "secretSelf": "string (2-3 sentences about hidden draws)",
  "emotionalHunger": "string (3-4 sentences about what they're starving for)",
  "digitalContradiction": "string (2-3 sentences about internal tensions)",
  "missing": "string (2-3 sentences about what's avoided)",
  "blindSpots": "string (4-5 sentences of hard truths)",
  "mirrorMoment": "string (one powerful, quotable sentence)"
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
