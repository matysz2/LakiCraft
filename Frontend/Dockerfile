# ==========================================
# ETAP 1: Budowanie aplikacji React (Node.js)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# ETAP 2: Serwowanie plików przez Nginx
# ==========================================
FROM nginx:1.25-alpine

# Kopiujemy skompilowane pliki statyczne Reacta
COPY --from=build /app/dist /usr/share/nginx/html

# POPRAWKA: Nadpisujemy GŁÓWNY plik konfiguracyjny Nginxa naszym plikiem
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]