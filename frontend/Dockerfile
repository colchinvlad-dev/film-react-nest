FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

FROM alpine:3.19 AS publish
WORKDIR /app
COPY --from=build /app/dist /app/dist
CMD ["tail", "-f", "/dev/null"]