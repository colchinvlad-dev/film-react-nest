FROM node:20-alpine AS build
WORKDIR /opt/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-alpine AS publish
WORKDIR /opt/backend
ENV NODE_ENV=production
RUN chown -R node:node /opt/backend
COPY --chown=node:node backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /opt/backend/dist ./dist
COPY --chown=node:node --from=build /opt/backend/public ./public

USER node
EXPOSE 3000
CMD ["node", "dist/main"]