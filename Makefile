.PHONY: all build lint test clean docker-up docker-down proto

# Default target
all: build

# Build all Go modules
build:
	cd core && go build ./...
	cd mocr && go build ./...

# Lint all Go modules
lint:
	@test -z "$$(cd core && gofmt -l .)" || (cd core && gofmt -l . && exit 1)
	@test -z "$$(cd mocr && gofmt -l .)" || (cd mocr && gofmt -l . && exit 1)
	cd core && go vet ./...
	cd mocr && go vet ./...

# Run tests
test:
	cd core && go test ./...
	cd mocr && go test ./...

# Clean build artifacts
clean:
	cd core && go clean
	cd mocr && go clean
	rm -rf gen/

# Generate protobuf code
proto:
	buf generate

# Run buf lint
proto-lint:
	buf lint

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

# Development
dev-core:
	cd core && go run ./cmd/core

dev-mocr:
	cd mocr && go run ./cmd/mocr

dev-life:
	cd life && python -m life.main

dev-agent:
	cd agent && npm run dev

# Local SearXNG-compatible search (no Docker required)
dev-searxng:
	python searxng/server.py

# With Docker (full SearXNG)
dev-searxng-docker:
	docker compose up -d searxng

# Install Go dependencies
deps-go:
	cd core && go mod tidy
	cd mocr && go mod tidy

# Install Python dependencies
deps-python:
	cd life && pip install -e .

# Install Node.js dependencies
deps-node:
	cd agent && npm install
