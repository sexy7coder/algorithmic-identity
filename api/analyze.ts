import type { IncomingMessage, ServerResponse } from 'node:http';
import OpenAI from 'openai';
import { del } from '@vercel/blob';

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

7. SHADOW TRUTH
One sentence only. A specific, behaviorally grounded observation that this person has probably not said to themselves — but would immediately recognise as true the moment they read it. Root it in a concrete pattern visible in the feed: what they keep consuming, what they keep avoiding, or what the gap between those two things implies about where they actually are right now. Example register: 'You consume beauty obsessively but haven't made anything in months.' Do not explain it. Do not soften it. Do not frame it as advice.

GUIDELINES:
- Write in second person ("you")
- Name specific content types, not vibes — "fitness transformation reels from aspirational accounts" not "health-focused content"
- Every claim must connect to something visible in the screenshots
- Avoid these words and phrases: tapestry, journey, curated, resonate, nuanced, authentic, story, narrative, emotional landscape (as a metaphor), lean into, spaces, chapter, mosaic, rich, deeply
- Shorter sentences over long poetic ones
- If you are uncertain about something, do not say it
- shadowTruth must name a specific behavior or avoidance, not a vague character trait

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
  "mirrorMoment": "string (one memorable sentence)",
  "shadowTruth": "string (one sentence, behaviorally specific, uncomfortably accurate, no softening)"
}`;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: object) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) });
  res.end(payload);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return send(res, 500, { error: 'Server configuration error: OPENAI_API_KEY is not set.' });
  }

  // Parse JSON body — Vercel passes the raw stream even without multer
  let urls: string[];
  try {
    const raw = await readBody(req);
    const body = JSON.parse(raw);
    urls = body.urls;
    if (!Array.isArray(urls) || urls.length === 0) {
      return send(res, 400, { error: 'No image URLs provided.' });
    }
  } catch {
    return send(res, 400, { error: 'Invalid request body — expected JSON { urls: string[] }.' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Pass blob URLs directly — OpenAI fetches them from Vercel's CDN, no base64 needed
    const imageContents = urls.map((url) => ({
      type: 'image_url' as const,
      image_url: { url },
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an analyst who reads Instagram explore feeds and gives honest, specific, grounded assessments. You do not flatter or generalize. You return valid JSON only.',
        },
        {
          role: 'user',
          content: [{ type: 'text', text: ANALYSIS_PROMPT }, ...imageContents],
        },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: 4096,
    });

    const content = response.choices[0].message.content || '{}';
    const analysis = JSON.parse(content);

    // Delete blobs before responding — keeps storage clean, adds <200ms
    await del(urls).catch((e) => console.error('Blob cleanup failed:', e));

    return send(res, 200, analysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    // Best-effort cleanup on failure too
    del(urls).catch(() => {});
    return send(res, 500, { error: 'Failed to analyze images.', details: error.message });
  }
}
