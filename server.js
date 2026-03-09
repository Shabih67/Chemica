const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── File Upload Config ──────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ── AI Setup ───────────────────────────────────────────────────
// We'll use fetch for OpenRouter for better reliability with custom keys
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openaiDirect = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Helper to parse JSON from AI strings (robust against markdown and prefix/suffix)
function parseAIJson(raw) {
  if (!raw) return null;
  let clean = raw.trim();
  clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  
  try {
    return JSON.parse(clean);
  } catch (e) {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch (e2) {}
    }
    return null;
  }
}

// ── Main AI Strategy ───────────────────────────────────────────
async function callAIConfigured(prompt, isJson = false, imageBuffer = null, imageMime = null) {
  const keys = [
    { type: 'openrouter', key: process.env.OPENROUTER_API_KEY_2, name: 'OpenRouter (sk-or-v1)' },
    { type: 'openrouter', key: process.env.OPENROUTER_API_KEY, name: 'OpenRouter (sk-2b9...)' },
    { type: 'openai', key: process.env.OPENAI_API_KEY, name: 'OpenAI Direct' },
    { type: 'gemini', key: process.env.GEMINI_API_KEY, name: 'Gemini Direct' }
  ];

  for (const provider of keys) {
    if (!provider.key) continue;
    
    try {
      console.log(`Attempting AI: ${provider.name}...`);
      
      if (provider.type === 'openrouter') {
        const payload = {
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: [] }]
        };

        const content = payload.messages[0].content;
        content.push({ type: "text", text: prompt });
        
        if (imageBuffer && imageMime) {
          content.push({
            type: "image_url",
            image_url: { url: `data:${imageMime};base64,${imageBuffer.toString('base64')}` }
          });
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${provider.key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "ChemCore Professional"
          },
          body: JSON.stringify({
            ...payload,
            response_format: isJson ? { type: "json_object" } : { type: "text" }
          })
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`OpenRouter Error: ${res.status} - ${err}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
      }

      if (provider.type === 'openai') {
        const response = await openaiDirect.chat.completions.create({
          model: "gpt-4o",
          messages: [{ 
            role: "user", 
            content: [
              { type: "text", text: prompt },
              ...(imageBuffer ? [{ type: "image_url", image_url: { url: `data:${imageMime};base64,${imageBuffer.toString('base64')}` } }] : [])
            ]
          }],
          response_format: isJson ? { type: "json_object" } : { type: "text" }
        });
        return response.choices[0].message.content;
      }

      if (provider.type === 'gemini') {
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: isJson ? { responseMimeType: "application/json" } : {}
        });
        
        const parts = [{ text: prompt }];
        if (imageBuffer) {
          parts.push({
            inlineData: {
              data: imageBuffer.toString('base64'),
              mimeType: imageMime
            }
          });
        }
        
        const result = await model.generateContent({ contents: [{ role: "user", parts }] });
        return result.response.text();
      }

    } catch (err) {
      console.warn(`${provider.name} failed:`, err.message);
    }
  }

  // Final Fallback: Pollinations (Legacy Free API)
  console.log('Using Pollinations AI (Free) final fallback...');
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: prompt }],
        jsonMode: isJson
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    throw new Error('All Intelligence providers failed. Please check your internet and API configuration.');
  }
}

// ── AI Chat Endpoint ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, context, history, mode } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const aiMode = mode || 'general';
    const systemPrompt = aiMode === 'solver'
      ? `You are ChemE-Solver, a senior chemical engineering professor specializing in thermodynamics, mass, and energy balances. Be precise and solve step-by-step with units.`
      : `You are ChemCore AI, a professional engineering assistant. Context: ${context || 'General Engineering'}. Be technical yet clear.`;

    const fullPrompt = `${systemPrompt}\n\nCHAT HISTORY:\n${JSON.stringify(history?.slice(-5))}\n\nUSER MESSAGE: ${message}`;
    const reply = await callAIConfigured(fullPrompt, false);
    res.json({ reply });
  } catch (err) {
    console.error('Chat Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Problem Solver Endpoint ──────────────────────────────────────
app.post('/api/solve', upload.single('file'), async (req, res) => {
  try {
    let problemText = req.body.problem || '';
    let imageBuffer = null;
    let imageMime = null;

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        problemText += `\n[EXTRACTED TEXT FROM PDF QUESTION]:\n${data.text}`;
        problemText += `\nNOTE: If this looks like a mass balance problem from a diagram, the AI should look for labels like %, flow rates, and terms like 'Recycle', 'Purge', 'Waste'.`;
      } else if (req.file.mimetype.startsWith('image/')) {
        imageBuffer = req.file.buffer;
        imageMime = req.file.mimetype;
        // Also do a quick OCR for context
        const ocr = await Tesseract.recognize(req.file.buffer, 'eng');
        problemText += `\n[OCR CONTEXT]: ${ocr.data.text}`;
      }
    }

    if (!problemText.trim() && !imageBuffer) {
      return res.status(400).json({ error: 'Please provide a question or an image.' });
    }

    const systemMsg = `You are a Senior Chemical Engineering Professor and Expert Solver. Solve the following chemical engineering problem.
If an image is provided, parse it visually for diagrams, streams, and labels.
Return ONLY a valid JSON object with the following structure:

{
  "classification": "Subject Type (e.g. Mass Balance with Recycle, Distillation, HX)",
  "given": ["Extracted data with units"],
  "assumptions": ["Key engineerng assumptions (e.g. Steady State)"],
  "sketch": "Block flow description of the system",
  "dof": { "unknowns": 10, "equations": 10, "dof": 0, "status": "Solvable" },
  "steps": [{ "n": 1, "label": "Balance over Mixer", "calc": "F = S + R", "result": "1200 kg/h" }],
  "results": ["Final answers bolded"],
  "verification": "Technical insight on why this answer is physically sound"
}`;

    const prompt = `${systemMsg}\n\nUSER INPUT / PROBLEM:\n${problemText}`;
    const raw = await callAIConfigured(prompt, true, imageBuffer, imageMime);
    const sol = parseAIJson(raw);

    if (sol) {
      res.json({ solution: sol });
    } else {
      res.json({ rawReply: raw });
    }
  } catch (err) {
    console.error('Solve Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  🟢 ChemCore Vision-Ready Server running at http://localhost:${PORT}`);
});
