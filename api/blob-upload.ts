import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { IncomingMessage, ServerResponse } from 'node:http';

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

export default async function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  try {
    const rawBody = await readBody(req);
    const body = JSON.parse(rawBody) as HandleUploadBody;

    // Build a minimal Web Fetch API Request so handleUpload can read auth headers
    const host = (req.headers.host as string) || 'localhost';
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (typeof val === 'string') headers.set(key, val);
      else if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
    }
    const webRequest = new Request(`https://${host}/api/blob-upload`, { method: 'POST', headers });

    const jsonResponse = await handleUpload({
      body,
      request: webRequest,
      onBeforeGenerateToken: async (_pathname) => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // Cleanup happens in /api/analyze after OpenAI finishes
      },
    });

    return send(res, 200, jsonResponse);
  } catch (error: any) {
    console.error('Blob upload token error:', error);
    return send(res, 400, { error: error.message });
  }
}
