FROM node:22-alpine AS builder

WORKDIR /app

COPY webui/package.json webui/package-lock.json* ./

RUN npm ci

COPY webui/ .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY webui/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
