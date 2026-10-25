FROM node:22-alpine AS builder

WORKDIR /app

COPY webui/package.json webui/package-lock.json* ./

RUN npm ci

COPY webui/ .

RUN npm run build

# Unprivileged base: the plain nginx image runs its master process as root;
# every other image in this repo already drops to a non-root user.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY webui/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
