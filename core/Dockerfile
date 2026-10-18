FROM node:22-alpine AS ui
WORKDIR /src
COPY webui/ ./webui/
COPY plugin-web/ ./plugin-web/
RUN cd webui && npm ci && npm run build:plugin
RUN for plugin in agent life minecraft skillsguishow; do cd /src/plugin-web/$plugin && npm ci && npm run build; done

FROM golang:1.27-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY gen/go/go.mod gen/go/go.sum ./gen/go/
COPY core/go.mod core/go.sum ./core/

# Download dependencies
WORKDIR /app/gen/go
RUN go mod download

WORKDIR /app/core
RUN go mod download

# Copy source code
COPY gen/go/ /app/gen/go/
COPY core/ /app/core/

# Build
WORKDIR /app/core
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/core-server ./cmd/core

# Runtime
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/core-server .
COPY --from=ui /src/core/data/plugin-ui/ /opt/0kay-ui/plugin-ui/
COPY webui/patches/ /opt/0kay-ui/ui/
COPY core/data/ui/platform.patch core/data/ui/fluentui.patch core/data/ui/skillsguishow.patch /opt/0kay-ui/ui/
COPY core/docker-entrypoint.sh /usr/local/bin/0kay-entrypoint
RUN chmod +x /usr/local/bin/0kay-entrypoint

# Run as an unprivileged user. The entrypoint seeds /app/data (plugin UI
# bundles, UI patches) and the server keeps providers/settings/pairing state
# there, so it must be writable. Named volumes seed ownership from the image
# on first mount; a pre-existing root-owned core-data volume needs a one-time
# `docker compose exec core chown -R 10001:10001 /app/data` (this image ships
# no su-exec/gosu for a root-owned-volume bootstrap).
RUN addgroup -S -g 10001 core \
    && adduser -S -u 10001 -G core -H -h /app core \
    && mkdir -p /app/data \
    && chown -R core:core /app/data

EXPOSE 50051 8080

USER core

ENTRYPOINT ["0kay-entrypoint"]
CMD ["./core-server"]
