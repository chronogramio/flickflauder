# flickflauder chat backend — Node service that proxies streaming chat to Claude
# and sends lead notifications. Built for ARM64 (Oracle ARM node in the cluster).
FROM node:22-alpine

WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Application code.
COPY index.js ./

# Transcripts are written here; mounted as a PVC in Kubernetes.
RUN mkdir -p /app/leads
ENV LEADS_DIR=/app/leads
ENV PORT=8787

EXPOSE 8787

CMD ["node", "index.js"]
