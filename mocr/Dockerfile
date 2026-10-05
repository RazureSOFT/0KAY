FROM golang:1.27-alpine AS builder

WORKDIR /app

COPY gen/go/go.mod gen/go/go.sum ./gen/go/
COPY mocr/go.mod mocr/go.sum ./mocr/

WORKDIR /app/gen/go
RUN go mod download

WORKDIR /app/mocr
RUN go mod download

COPY gen/go/ /app/gen/go/
COPY mocr/ /app/mocr/

WORKDIR /app/mocr
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/mocr-server ./cmd/mocr

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/mocr-server .

# Run as an unprivileged user. Usage reports land in MOCR_DATA_DIR (default
# ./data under the workdir), so point it at the chowned directory.
RUN addgroup -S -g 10001 mocr \
    && adduser -S -u 10001 -G mocr -H -h /app mocr \
    && mkdir -p /app/data \
    && chown -R mocr:mocr /app/data

ENV MOCR_DATA_DIR=/app/data

EXPOSE 50052

USER mocr

CMD ["./mocr-server"]
