FROM node:22-alpine

# Build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Increase heap and install n8n
RUN NODE_OPTIONS="--max-old-space-size=4096" npm install -g n8n@2.13.0 --ignore-scripts=false


RUN addgroup -S node || true
WORKDIR /home/node
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node

USER node

# Set environment variables
ENV N8N_PORT=5678
ENV N8N_HOST=localhost
ENV NODE_ENV=production

# Expose port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
