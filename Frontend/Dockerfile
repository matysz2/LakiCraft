# ==========================================
# ETAP 1: Budowanie aplikacji React (Node.js)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Kopiujemy pliki opisujące zależności
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy cały kod źródłowy frontendu
COPY . .

# Budujemy wersję produkcyjną (tworzy folder /app/build)
RUN npm run build

# ==========================================
# ETAP 2: Serwowanie plików przez Nginx
# ==========================================
FROM nginx:1.25-alpine

# Kopiujemy skompilowane pliki Reacta do katalogu, z którego Nginx serwuje stronę
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiujemy niestandardową konfigurację Nginx (potrzebną przy React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]