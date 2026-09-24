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

WORKDIR /root/

COPY --from=builder /app/mocr-server .

EXPOSE 50052

CMD ["./mocr-server"]
