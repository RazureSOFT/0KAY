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

EXPOSE 50051 8080

CMD ["./core-server"]
