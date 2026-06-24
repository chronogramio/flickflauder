# flickflauder chat server

A small self-hosted backend for the website's chat agent. It holds the
Anthropic API key and streams a conversation with Claude back to the browser —
the key never leaves your infrastructure.

## Run locally

```bash
cd server
npm install
cp .env.example .env        # then put your real ANTHROPIC_API_KEY in .env
ALLOWED_ORIGIN=* node --env-file=.env index.js
```

The server listens on `http://localhost:8787`. Point the website at it by
setting `PUBLIC_CHAT_API_URL=http://localhost:8787` when running the site dev
server (see the repo root).

Quick check:

```bash
curl http://localhost:8787/health
curl -N -X POST http://localhost:8787/chat \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Was bietet flickflauder?"}]}'
```

## Deploy on your own infra

1. Copy the `server/` directory to the host.
2. `npm install --omit=dev`
3. Provide env vars (`.env` file, systemd unit, or your process manager):
   - `ANTHROPIC_API_KEY` — required, secret
   - `ALLOWED_ORIGIN` — `https://flickflauder.com`
   - `PORT` — whatever your reverse proxy expects
   - `CHAT_MODEL` — `claude-opus-4-8` (default) or `claude-haiku-4-5` for lower cost
4. Put it behind TLS (reverse proxy / your platform's HTTPS).
5. Set `PUBLIC_CHAT_API_URL` to the public URL when building the website.

## Endpoints

- `GET /health` → `{ ok, model }`
- `POST /chat` → streams `text/plain` deltas. Body: `{ "messages": [{ "role": "user" | "assistant", "content": "..." }] }`

Built-in guards: per-IP rate limit (30 requests / 5 min), 64 KB body cap, last
20 messages kept, 4000 chars per message.

## Lead notifications

Every conversation is written to `leads/<date>_<sessionid>.json`. In addition,
the moment a visitor leaves an email address the server pushes **one**
notification per conversation via Slack and/or email (whichever is configured —
both are optional and silently skipped if their env vars are unset):

- **Slack** — set `SLACK_WEBHOOK_URL` to a Slack Incoming Webhook URL.
- **Email** — set `LEAD_EMAIL_TO` plus SMTP credentials (`SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, optional `LEAD_EMAIL_FROM`). With
  Gmail, use an App Password (not your account password). The lead's address is
  set as `Reply-To`, so you can reply straight from the notification.

If neither is configured, leads are still captured in the `leads/` folder — you
just won't get pushed a notification.
