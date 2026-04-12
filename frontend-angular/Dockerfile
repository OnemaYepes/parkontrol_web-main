# ── Stage 1: Build ──────────────────────────────────────────  
FROM node:20-alpine AS builder  
WORKDIR /app  
  
COPY package*.json ./  
RUN npm ci  
  
COPY . .  
RUN npm run build  
  
# ── Stage 2: Production (nginx) ─────────────────────────────  
FROM nginx:alpine AS production  
  
# Copia el output del nuevo builder (@angular/build:application)  
COPY --from=builder /app/dist/frontend-angular/browser /usr/share/nginx/html  
COPY nginx.conf /etc/nginx/conf.d/default.conf  
  
EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]