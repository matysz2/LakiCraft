# ==========================================
# ETAP 1: Budowanie aplikacji React (Node.js)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Kopiujemy pliki opisujące zależności (dla optymalizacji cache warstw)
COPY package*.json ./

# Instalujemy zależności produkcyjnie (dokładnie wg package-lock.json)
RUN npm ci

# Kopiujemy cały kod źródłowy frontendu
COPY . .

# Budujemy wersję produkcyjną (dla Vite tworzy folder /app/dist)
RUN npm run build

# ==========================================
# ETAP 2: Serwowanie plików przez Nginx
# ==========================================
FROM nginx:1.25-alpine

# Usuwamy domyślną konfigurację Nginxa, aby nasza miała priorytet
RUN rm /etc/nginx/conf.d/default.conf

# Kopiujemy skompilowane pliki statyczne Reacta (z folderu /app/dist z Etapu 1)
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiujemy naszą niestandardową konfigurację Nginx (z Reverse Proxy do Backend-u)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]