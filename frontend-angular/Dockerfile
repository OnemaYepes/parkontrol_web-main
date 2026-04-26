# Build
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Serve con nginx
FROM nginx:alpine

COPY --from=build /app/dist/frontend-angular/browser/ /usr/share/nginx/html

EXPOSE 80