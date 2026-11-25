FROM node:18-alpine AS build
WORKDIR /opt/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci || npm install
COPY backend/ ./
RUN npm run build

FROM node:18-alpine AS publish
WORKDIR /opt/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=build /opt/backend/dist ./dist
COPY --from=build /opt/backend/public ./public

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main"]