#!/bin/sh

# Inject runtime env vars into the browser
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  RAG_API_SERVER_URL: "${RAG_API_SERVER_URL:-http://localhost:8000}"
};
EOF

echo "Injected env-config.js with RAG_API_SERVER_URL=${RAG_API_SERVER_URL}"

exec "$@"