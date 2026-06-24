# Deployment

Frontend and backend deploy independently via GitLab CI (`.gitlab-ci.yml`).

## Frontend — Cloudflare Pages
- Static Astro build (`output: 'static'`, no SSR adapter) → `wrangler pages deploy dist`.
- Backend URL is baked in at build time as `PUBLIC_CHAT_API_URL`
  (defaults to `https://chat.flickflauder.com`).
- Pipeline: `build:frontend` (auto) → `deploy:frontend` (**manual**).

## Backend — K3s cluster
- Node chat/lead server in `server/`, built with Kaniko (ARM64) →
  `registry.flickflauder.com/freelance/flickflauder/backend`.
- Manifests in `k8s/`: namespace, backend Deployment+Service+PVC, ingress.
- Exposed at `https://chat.flickflauder.com` (nginx ingress + cert-manager TLS).
- Runs on the ARM64 node (`nodeSelector: kubernetes.io/arch: arm64`).
- Transcripts persist on a `local-path` PVC mounted at `/app/leads`.
- Pipeline: `build:backend` (auto) → `deploy:backend` (**manual**).

## Required GitLab CI/CD variables
Set under Settings → CI/CD → Variables (mask sensitive ones):

| Variable | Used by | Notes |
|----------|---------|-------|
| `CLOUDFLARE_API_TOKEN` | deploy:frontend | Pages:Edit token |
| `CLOUDFLARE_ACCOUNT_ID` | deploy:frontend | |
| `CLOUDFLARE_PROJECT_NAME` | deploy:frontend | optional, defaults to `flickflauder` |
| `PUBLIC_CHAT_API_URL` | build:frontend | optional, defaults to `https://chat.flickflauder.com` |
| `KUBECONFIG` | deploy:backend | file-type variable, cluster kubeconfig |
| `ANTHROPIC_API_KEY` | deploy:backend | **required**, masked |
| `SLACK_WEBHOOK_URL` | deploy:backend | optional lead notifications |
| `LEAD_EMAIL_TO` / `LEAD_EMAIL_FROM` | deploy:backend | optional |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | deploy:backend | optional email |

The registry pull secret (`gitlab-registry`) and the app secret
(`flickflauder-chat`) are created automatically by `deploy:backend` from the
CI job token and the variables above.

## First deploy
1. Set the CI/CD variables above.
2. Push to `main` → builds run automatically.
3. Run `deploy:backend` (creates namespace, secrets, rolls out; cert-manager
   issues the TLS cert for `chat.flickflauder.com`).
4. Run `deploy:frontend` (publishes to Cloudflare Pages).

DNS: `*.flickflauder.com` already resolves to the cluster (mercury), so
`chat.flickflauder.com` needs no DNS change.
