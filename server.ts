import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Allow large payloads for video/audio/pdf base64 uploads (up to 60MB)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Helper to strip markdown code fences from JSON
function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * POST /api/wiki/generate
 * Ingests video, audio, PDF, or text and synthesizes a full LLM Wiki with citations
 */
app.post('/api/wiki/generate', async (req: Request, res: Response) => {
  try {
    const { sourceType, sourceName, sourceData, mimeType, userNotes } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    if (!sourceType || (!sourceData && !userNotes)) {
      return res.status(400).json({ error: 'Missing source content to analyze.' });
    }

    const systemPrompt = `You are an elite research encyclopedist and multimodal knowledge synthesizer.
Your task is to transform the provided source material (video, audio, PDF document, or text transcript) into a world-class, rigorous, encyclopedic LLM Wiki Knowledge Base.

CRITICAL REQUIREMENTS:
1. CITATION ACCURACY & SPECIFICITY:
   - Every substantive claim in every article MUST include an inline citation marker, formatted exactly as [cite:C1], [cite:C2], etc.
   - For every citation ID (C1, C2, etc.), provide an exact entry in the "citations" dictionary.
   - If the source is a VIDEO or AUDIO:
     * Estimate or extract real, precise timestamps (timestampStart, timestampEnd in seconds, e.g. 75, 120, and timestampLabel e.g. "01:15 - 02:00").
     * Provide a VERBATIM quotation from that moment in the dialogue or presentation.
   - If the source is a PDF or document:
     * Estimate or detect the pageNumber (e.g. 1, 2, 4) and section heading.
     * Provide a VERBATIM quotation from that page.
   - Never fabricate non-existent quotes; ensure the verbatim quote reflects the true ingested content.

2. STRUCTURE OF THE WIKI:
   - "title": A clear, authoritative title for this knowledge base.
   - "synopsis": 2-3 sentences summarizing the core thesis, domain, and scope.
   - "overviewTakeaways": 3-5 high-impact executive takeaways.
   - "articles": 3 to 6 comprehensive, deep-dive wiki articles. Each article must have:
     * "id": e.g. "art-1"
     * "slug": URL-friendly slug
     * "title": Editorial title with numbered prefix (e.g. "01. Architectural Foundations")
     * "subtitle": Explanatory subtitle
     * "category": Domain category (e.g. "Theory", "Empirical Evaluation", "Methodology")
     * "readingTimeMinutes": integer (3-7)
     * "summary": 2-sentence summary
     * "keyTakeaways": 2-3 bullets
     * "sections": 2-4 sections with "heading" and rich "content" containing inline [cite:C#] tags.
   - "citations": An object where keys are "C1", "C2", etc., and values have:
     * "id": "C1"
     * "sourceType": "${sourceType}"
     * "sourceTitle": "${sourceName || 'Source Material'}"
     * "timestampStart": number (optional, for video/audio)
     * "timestampEnd": number (optional, for video/audio)
     * "timestampLabel": string (e.g. "02:15 - 02:45" or "Page 4")
     * "pageNumber": number (optional, for PDF)
     * "sectionHeading": string
     * "quote": string (verbatim quote)
     * "context": string (why this evidence supports the claim)
     * "confidence": number (e.g. 0.95)
   - "glossary": 4-8 specialized terms, each with "term", "definition", and optional "citationId".
   - "timeline": 4-8 chronological milestones or chapter markers with "id", "timestamp" (e.g. "03:15" or "Section 2"), "seconds", "title", "description", "citationId".
   - "entityGraph": 4-8 conceptual entities with "id", "name", "type" ('concept'|'technology'|'person'|'metric'|'organization'), "description", "connections" (array of other entity names).
   - "suggestedQuestions": 4-6 probing questions that a researcher would ask to test the nuances of this wiki.

OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema without any markdown wrapper or explanation outside the JSON.`;

    const contents: any[] = [];

    // If sourceData is base64 (for video, audio, or pdf)
    if (sourceType === 'video' || sourceType === 'audio' || sourceType === 'pdf') {
      let resolvedMime = mimeType;
      if (!resolvedMime) {
        if (sourceType === 'video') resolvedMime = 'video/mp4';
        else if (sourceType === 'audio') resolvedMime = 'audio/mp3';
        else if (sourceType === 'pdf') resolvedMime = 'application/pdf';
      }

      // If sourceData is a base64 data URL (e.g. "data:application/pdf;base64,..."), extract the raw base64
      let base64Clean = sourceData;
      if (base64Clean.includes(',')) {
        base64Clean = base64Clean.split(',')[1];
      }

      contents.push({
        inlineData: {
          mimeType: resolvedMime,
          data: base64Clean,
        },
      });

      contents.push({
        text: `Analyze this ${sourceType.toUpperCase()} file titled "${sourceName || 'Uploaded File'}". ${
          userNotes ? `User notes/context: ${userNotes}` : ''
        }\n\nGenerate the complete JSON Wiki Knowledge Base with verbatim citations now.`,
      });
    } else {
      // Text or markdown source
      contents.push({
        text: `Source Document: "${sourceName || 'Text Document'}"\n\nContent:\n${sourceData}\n\n${
          userNotes ? `Additional User Focus: ${userNotes}\n` : ''
        }\nGenerate the complete JSON Wiki Knowledge Base with verbatim citations now.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(cleanJson(rawText));

    // Ensure baseline fields exist
    const wikiId = 'wiki-' + Date.now();
    const finalWiki = {
      id: wikiId,
      title: parsedData.title || `Wiki: ${sourceName || 'Multimodal Source'}`,
      synopsis: parsedData.synopsis || 'Comprehensive synthesis of the ingested source material.',
      sourceType: sourceType,
      sourceName: sourceName || 'Uploaded Source',
      createdAt: new Date().toISOString(),
      stats: {
        articleCount: parsedData.articles?.length || 0,
        citationCount: Object.keys(parsedData.citations || {}).length,
        termsCount: parsedData.glossary?.length || 0,
        durationOrPages:
          sourceType === 'video' || sourceType === 'audio'
            ? 'Multimodal Media'
            : sourceType === 'pdf'
            ? 'Document Synthesis'
            : 'Text Source',
      },
      overviewTakeaways: parsedData.overviewTakeaways || [],
      articles: parsedData.articles || [],
      citations: parsedData.citations || {},
      glossary: parsedData.glossary || [],
      timeline: parsedData.timeline || [],
      entityGraph: parsedData.entityGraph || [],
      suggestedQuestions: parsedData.suggestedQuestions || [],
    };

    return res.json(finalWiki);
  } catch (error: any) {
    console.error('Error generating wiki:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize wiki from source material.',
    });
  }
});

/**
 * POST /api/wiki/ask
 * Answers user questions grounded in the synthesized Wiki Knowledge Base and citations
 */
app.post('/api/wiki/ask', async (req: Request, res: Response) => {
  try {
    const { question, wikiContext, chatHistory } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const systemPrompt = `You are an expert Q&A engine for an interactive LLM Wiki Knowledge Base.
Your job is to provide deep, analytical, verifiable answers grounded in the provided Wiki material.

GROUNDING & CITATION RULES:
1. Provide a comprehensive, articulate, academic response.
2. Embed inline citation markers [cite:C1], [cite:C2] etc., whenever making a factual assertion or quoting data.
3. Every citation referenced in the text MUST appear in the "citations" array with:
   - "id": e.g. "C1"
   - "sourceTitle": title of the source
   - "timestampLabel": e.g. "03:15" (for audio/video) or "Page 5" (for PDF)
   - "timestampStart": number (seconds) if audio/video
   - "quote": exact verbatim quote supporting this statement
   - "context": why this citation is relevant
4. Provide 2-3 crisp "keyTakeaways".
5. Provide 2-3 logical "followUpQuestions" to stimulate deeper investigation.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following schema:
{
  "answer": "string formatted with markdown and [cite:C#] tags",
  "citations": [
    {
      "id": "string",
      "sourceTitle": "string",
      "timestampLabel": "string",
      "timestampStart": 120,
      "quote": "string",
      "context": "string"
    }
  ],
  "keyTakeaways": ["point 1", "point 2"],
  "followUpQuestions": ["question 1", "question 2"]
}`;

    const contextPayload = `
WIKI TITLE: ${wikiContext?.title || 'Knowledge Base'}
SYNOPSIS: ${wikiContext?.synopsis || ''}
SOURCE TYPE: ${wikiContext?.sourceType || 'document'}
SOURCE NAME: ${wikiContext?.sourceName || ''}

EXISTING ARTICLES OVERVIEW:
${(wikiContext?.articles || [])
  .map(
    (a: any) =>
      `Article: ${a.title}\nCategory: ${a.category}\nSummary: ${a.summary}\nTakeaways: ${(a.keyTakeaways || []).join('; ')}\nSections:\n${(a.sections || [])
        .map((s: any) => `  - ${s.heading}: ${s.content}`)
        .join('\n')}`
  )
  .join('\n\n')}

EXISTING CITATION POOL:
${JSON.stringify(wikiContext?.citations || {}, null, 2)}

GLOSSARY TERMS:
${(wikiContext?.glossary || []).map((g: any) => `${g.term}: ${g.definition}`).join('\n')}

CHAT HISTORY:
${(chatHistory || []).map((m: any) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n')}

USER QUESTION:
"${question}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contextPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(cleanJson(rawText));

    return res.json({
      answer: parsed.answer || 'No direct answer could be synthesized from the wiki material.',
      citations: parsed.citations || [],
      keyTakeaways: parsed.keyTakeaways || [],
      followUpQuestions: parsed.followUpQuestions || [],
    });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process Q&A request.',
    });
  }
});

// Setup Vite in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WikiSynth server listening on port ${PORT}`);
  });
}

startServer();
