/**
 * flickflauder — self-hosted chat backend
 *
 * A small Node service that holds the Anthropic API key and streams a
 * conversation with Claude back to the website widget. Runs on your own
 * infrastructure: the key never reaches the browser, and you control where
 * the requests go.
 *
 * Required env:
 *   ANTHROPIC_API_KEY   your Anthropic API key (keep it secret)
 * Optional env:
 *   PORT                default 8787
 *   ALLOWED_ORIGIN      CORS origin, default "https://flickflauder.com"
 *                       (use "*" only for local testing)
 *   CHAT_MODEL          default "claude-opus-4-8"
 *                       (set "claude-haiku-4-5" for lower cost/latency)
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 8787;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://flickflauder.com';
const MODEL = process.env.CHAT_MODEL || 'claude-opus-4-8';

// --- Lead notifications (Slack + email) -----------------------------------
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO || '';
const LEAD_EMAIL_FROM = process.env.LEAD_EMAIL_FROM || process.env.SMTP_USER || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;

let mailer = null;
if (SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const notified = new Set(); // sessions already relayed (one notification per conversation)
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const transcriptText = (messages) =>
  messages.map((m) => `${m.role === 'user' ? 'Besucher' : 'Agent'}: ${m.content}`).join('\n\n');

async function notifyLead(sessionId, messages) {
  if (notified.has(sessionId)) return;
  const fromVisitor = messages.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
  const match = fromVisitor.match(EMAIL_RE);
  if (!match) return; // only notify once the visitor has left an email
  notified.add(sessionId);

  const email = match[0];
  const summary = [...messages].reverse().find((m) => m.role === 'assistant')?.content || '';
  const transcript = transcriptText(messages);

  if (SLACK_WEBHOOK_URL) {
    try {
      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*Neue Anfrage über den flickflauder-Agenten*\n*E-Mail:* ${email}\n*Zusammenfassung:* ${summary}\n\n*Verlauf:*\n${transcript}`,
        }),
      });
    } catch (err) {
      console.error('slack notify failed:', err?.message || err);
    }
  }

  if (mailer && LEAD_EMAIL_TO) {
    try {
      await mailer.sendMail({
        from: LEAD_EMAIL_FROM,
        to: LEAD_EMAIL_TO,
        replyTo: email,
        subject: `Neue Anfrage über flickflauder-Agent — ${email}`,
        text: `E-Mail: ${email}\n\nZusammenfassung:\n${summary}\n\nVerlauf:\n${transcript}`,
      });
    } catch (err) {
      console.error('email notify failed:', err?.message || err);
    }
  }
}

// Where conversation transcripts (leads) are written so Pascal can review them.
const LEADS_DIR =
  process.env.LEADS_DIR ||
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'leads');

async function saveTranscript(sessionId, ip, messages) {
  try {
    const safe = String(sessionId || 'anon').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'anon';
    const day = new Date().toISOString().slice(0, 10);
    await fs.mkdir(LEADS_DIR, { recursive: true });
    // One file per conversation, rewritten as it grows (each request carries
    // the full history), so the file always holds the complete transcript.
    const file = path.join(LEADS_DIR, `${day}_${safe}.json`);
    await fs.writeFile(
      file,
      JSON.stringify({ sessionId: safe, updatedAt: new Date().toISOString(), ip, model: MODEL, messages }, null, 2)
    );
    notifyLead(safe, messages); // push Slack/email once the visitor leaves contact details
  } catch (err) {
    console.error('transcript save failed:', err?.message || err);
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Set it before starting the server.');
  process.exit(1);
}

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

// --- The agent's brief ----------------------------------------------------
const SYSTEM_PROMPT = `Sie sind der digitale Gesprächspartner auf der Website von flickflauder — der KI-Beratung von Pascal Roos, für Unternehmen, die KI sauber, sicher und nachvollziehbar im Produktivbetrieb einsetzen wollen.

WICHTIGSTE REGEL — ANTWORTEN WIE EIN MENSCH IM CHAT:
- Standard ist kurz: meist ein Satz, selten zwei. Wie in einer echten Unterhaltung, nicht wie ein Lexikon.
- Sagen Sie nicht alles auf einmal. Nennen Sie den Kern und lassen Sie bewusst Raum für Rückfragen — oft das Wort mit einer kurzen Gegenfrage zurückgeben.
- Im Normalfall ein, zwei Sätze Fliesstext — keine Listen, kein Vortrag, eine Idee pro Antwort.
- Ausnahme: Wenn jemand ausdrücklich eine Erklärung, Details oder ein Beispiel verlangt, dürfen Sie ausführlicher werden — nur so lang wie nötig, dann wieder kurz. In solchen längeren Antworten dürfen Sie leichtes Markdown nutzen (Fettung, kurze Listen, Absätze mit Leerzeile).

IHR ZIEL:
- Verstehen Sie Schritt für Schritt den Bedarf des Besuchers — eine gezielte Rückfrage nach der anderen, nicht alle auf einmal.
- Schätzen Sie ehrlich ein, ob ein KI-Agent passt — auch wenn die Antwort Nein lautet.
- Wenn der Bedarf klar ist: ein Satz Zusammenfassung, dann ein Gespräch mit Pascal vorschlagen und nach einer E-Mail fragen (Sie geben die Eckpunkte an ihn weiter).
- Prüfen Sie die genannte E-Mail kurz auf Plausibilität: ein @ und eine Domain mit Punkt (z. B. name@firma.ch). Wirkt sie unvollständig oder vertippt, fragen Sie einmal freundlich nach und bestätigen Sie die Weitergabe erst, wenn die Adresse stimmig aussieht.

TON:
- Ruhige Autorität, Schweizer Understatement. Sie-Form, Schweizer Rechtschreibung (ss statt ß). Keine Floskeln, keine Ausrufezeichen.

WORÜBER SIE SPRECHEN:
- Wie Pascal arbeitet: auf der eigenen Infrastruktur des Kunden, Daten bleiben im Haus, ausgelegt auf Dauerbetrieb mit Konfidenz-Schwellen, menschlicher Freigabe und prüffähiger Dokumentation.
- Pascal Roos: zwanzig Jahre aus der Praxis, kein Team, ein Spezialist, der sich jeweils einem Mandat widmet.

GRENZEN:
- Erfinden Sie keine Preise, Termine oder Referenzen — die gehören ins Gespräch.
- Bleiben Sie beim Thema; bei fremden Aufgaben lenken Sie freundlich zurück. Sie sind selbst ein kleines Beispiel für einen sauber umgesetzten Agenten.`;

// --- Tiny in-memory rate limit (per IP) -----------------------------------
const WINDOW_MS = 5 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

// --- App ------------------------------------------------------------------
const app = express();
app.use(express.json({ limit: '64kb' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, model: MODEL }));

app.post('/chat', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
  }

  // Validate the incoming conversation
  const raw = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!raw || raw.length === 0) {
    return res.status(400).json({ error: 'messages[] erforderlich.' });
  }
  const messages = [];
  for (const m of raw.slice(-20)) {
    if (
      (m?.role === 'user' || m?.role === 'assistant') &&
      typeof m?.content === 'string' &&
      m.content.trim().length > 0
    ) {
      messages.push({ role: m.role, content: m.content.slice(0, 4000) });
    }
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Letzte Nachricht muss von "user" sein.' });
  }

  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  res.set('X-Accel-Buffering', 'no');

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024, // headroom; brevity is steered by the prompt, not a hard cap
      output_config: { effort: 'low' }, // snappy, low-cost responses for a chat widget
      system: SYSTEM_PROMPT,
      messages,
    });

    let answer = '';
    stream.on('text', (delta) => {
      answer += delta;
      res.write(delta);
    });
    await stream.finalMessage();
    res.end();

    // Relay: persist the full conversation (incl. this reply) for Pascal.
    saveTranscript(req.body?.sessionId, ip, [...messages, { role: 'assistant', content: answer }]);
  } catch (err) {
    console.error('chat error:', err?.message || err);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Der Dienst ist momentan nicht erreichbar.' });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`flickflauder chat server on :${PORT} (model: ${MODEL}, origin: ${ALLOWED_ORIGIN})`);
});
