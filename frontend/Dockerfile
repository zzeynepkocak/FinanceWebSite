# ── Build stage ───────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Production build — Keycloak gerçek mode
ARG VITE_KEYCLOAK_URL=http://localhost:8080
ARG VITE_KEYCLOAK_REALM=toyota-finance
ARG VITE_KEYCLOAK_CLIENT=finance-portal-app
ARG VITE_API_BASE=http://localhost:8081
ARG VITE_MOCK_AUTH=false

RUN npm run build

# ── Runtime: nginx ────────────────────────────────
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
