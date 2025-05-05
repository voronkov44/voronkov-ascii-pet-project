FROM node:20-alpine AS build

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
