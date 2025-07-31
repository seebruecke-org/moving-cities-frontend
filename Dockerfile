FROM node:18.20.8-slim as base

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

## Install Dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


## Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

ARG FRONTEND_URL
ENV FRONTEND_URL=${FRONTEND_URL}
ENV NEXT_PUBLIC_FRONTEND_URL=${FRONTEND_URL}

ARG NEXT_IMAGE_HOSTNAME
ENV NEXT_IMAGE_HOSTNAME=${NEXT_IMAGE_HOSTNAME}

ARG NEXT_PUBLIC_API_ENDPOINT
ENV NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT}

ARG NEXT_PUBLIC_ASSET_URL
ENV NEXT_PUBLIC_ASSET_URL=${NEXT_PUBLIC_ASSET_URL}

ARG NEXT_PUBLIC_GRAPHQL_API
ENV NEXT_PUBLIC_GRAPHQL_API=${NEXT_PUBLIC_GRAPHQL_API}

ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=${NEXT_PUBLIC_GRAPHQL_ENDPOINT}

ARG MAPBOX_TOKEN
ENV MAPBOX_TOKEN=${MAPBOX_TOKEN}
ENV NEXT_PUBLIC_MAPBOX_TOKEN=${MAPBOX_TOKEN}

ARG MATOMO_ENDPOINT
ENV MATOMO_ENDPOINT=${MATOMO_ENDPOINT}

ARG MATOMO_SITE_ID
ENV MATOMO_SITE_ID=${MATOMO_SITE_ID}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build && mkdir -p /app/.next/cache

EXPOSE 3000
ENV PORT 3000

VOLUME ["/app/.next/cache"]
CMD ["yarn", "start"]
