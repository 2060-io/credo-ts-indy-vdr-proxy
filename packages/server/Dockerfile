# Setup
FROM node:22 AS base

RUN corepack enable

# Create app directory
WORKDIR /app

# Copy source code into app folder
COPY . /app

RUN rm -rf node_modules

RUN pnpm install --frozen-lockfile
RUN pnpm cache clean
RUN pnpm --filter credo-ts-indy-vdr-proxy-server... build

RUN cp -r ./packages/server/res ./res

# Create a volume for the Credo agent data, allow read write access
RUN mkdir /var/credo && \
  chmod 777 /var/credo

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "packages/server/dist/main.js"]