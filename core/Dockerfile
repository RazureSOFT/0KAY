FROM node:22-alpine AS ui
# The build script is bash; the alpine node image ships only /bin/sh.
RUN apk add --no-cache bash
WORKDIR /src
COPY webui/ ./webui/
COPY plugin-web/ ./plugin-web/
# One script, not a parallel list in the Dockerfile: the same code path builds
# these pages locally, in CI and here, so a page cannot exist in one and be
# missing in another.
COPY scripts/build-plugin-ui.sh ./scripts/build-plugin-ui.sh
RUN bash scripts/build-plugin-ui.sh

FROM golang:1.27-alpine AS builder

WORKDIR /app

# Copy go mod files
#
# core/go.mod replaces 0kay/gen and 0kay/obs with local paths, so both modules
# have to be present before `go mod download` runs. Copying only the go.mod files
# left those targets missing and download failed with a resolve error that said
# nothing about the cause.
COPY gen/go/go.mod gen/go/go.sum ./gen/go/
COPY obs/go.mod obs/go.sum ./obs/
COPY core/go.mod core/go.sum ./core/

# Download dependencies
WORKDIR /app/gen/go
RUN go mod download

WORKDIR /app/core
RUN go mod download

# Copy source code
COPY gen/go/ /app/gen/go/
COPY obs/ /app/obs/
COPY core/ /app/core/

# Build
WORKDIR /app/core
# notray: the tray needs cgo and a GUI toolkit, and a container has neither.
# The package keeps the same API without it; the icon is simply absent.
RUN CGO_ENABLED=0 GOOS=linux go build -tags notray -o /app/core-server ./cmd/core

# Runtime
FROM alpine:3.20

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/core-server .
COPY --from=ui /src/core/data/plugin-ui/ /opt/0kay-ui/plugin-ui/
COPY webui/patches/ /opt/0kay-ui/ui/
COPY core/data/ui/platform.patch core/data/ui/skillsguishow.patch /opt/0kay-ui/ui/
# fluentui.patch under core/data/ui is a gitignored runtime artifact; the
# source of truth is the plugin's patches/ dir, so a fresh clone can build.
COPY plugin-web/fluentui/patches/fluentui.patch /opt/0kay-ui/ui/fluentui.patch
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
