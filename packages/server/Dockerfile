# Setup
FROM node:22 AS base

RUN corepack enable

# Create app directory
WORKDIR /app

# Copy source code into app folder
COPY ./src ./src
COPY ./res ./res
COPY *.json .

# Build server
FROM base AS builder

RUN pnpm install && \
  pnpm cache clean && \
  pnpm build

# Run server
FROM builder AS runner

# Create a volume for the Credo agent data, allow read write access
RUN mkdir /var/credo && \
  chmod 777 /var/credo

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "dist/main.js"]