# Setup
FROM node:22 AS base

# Setup env variable for yarn
ENV YARN_VERSION=4.3.1

# Update dependencies, add python to the base image, install and use yarn 4.x
RUN apt-get update && \
  corepack enable && \
  corepack prepare yarn@${YARN_VERSION}

# Create app directory
WORKDIR /app

# Copy source code into app folder
COPY . .

# Build server
FROM base AS builder

# Fix for node-gyp issues (Yarn 4 doesn't do global installs), install deps and remove created cache, run build
RUN npm install -g node-gyp && \
  yarn install --immutable && \
  yarn cache clean && \
  yarn build

# Run server
FROM builder AS runner

# Create a volume for the Credo agent data, allow read write access
RUN mkdir /var/credo && \
  chmod 777 /var/credo

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "build/main.js"]