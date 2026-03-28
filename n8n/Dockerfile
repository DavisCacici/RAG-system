FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    python3 \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g n8n@latest \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a user to run n8n (standard: node user with UID 1000)
RUN useradd -ms /bin/bash -u 1000 node

# Create n8n directory and set permissions
WORKDIR /home/node
RUN mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node && \
    chmod -R 755 /home/node

USER node

# Set environment variables
ENV N8N_PORT=5678
ENV N8N_HOST=localhost
ENV NODE_ENV=production

# Expose port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
