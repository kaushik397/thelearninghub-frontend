# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.11.0

# Base image for node build/runtime stages.
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

# Install production dependencies (optional cache layer).
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Install full deps and build static assets.
FROM base AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

# Runtime stage: serve built app via vite preview.
FROM base AS final
ENV NODE_ENV=production
USER node

COPY package.json package-lock.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
