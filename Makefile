.PHONY: all build lint test test-life clean docker-up docker-down proto deps-python

# Default target
all: build

# Build all Go modules
build:
	cd obs && go build ./...
	cd core && go build ./...
	cd mocr && go build ./...

# Lint all Go modules
lint:
	@test -z "$$(cd obs && gofmt -l .)" || (cd obs && gofmt -l . && exit 1)
	@test -z "$$(cd core && gofmt -l .)" || (cd core && gofmt -l . && exit 1)
	@test -z "$$(cd mocr && gofmt -l .)" || (cd mocr && gofmt -l . && exit 1)
	cd obs && go vet ./...
	cd core && go vet ./...
	cd mocr && go vet ./...

# Run tests
test:
	cd obs && go test ./...
	cd core && go test ./...
	cd mocr && go test ./...

# Clean build artifacts
clean:
	cd obs && go clean
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
#
# The LIFE plugin's own venv may be uv-created, in which case there is no `pip`
# on PATH and `python -m pip install -e .` fails.  Resolve the interpreter once:
# its venv when present, otherwise whatever `python` is on PATH.
LIFE_PY := $(shell if [ -x life/.venv/Scripts/python.exe ]; then echo .venv/Scripts/python.exe; elif [ -x life/.venv/bin/python ]; then echo .venv/bin/python; else echo python; fi)

dev-core:
	cd core && go run ./cmd/core

dev-mocr:
	cd mocr && go run ./cmd/mocr

dev-life:
	cd life && $(LIFE_PY) -m life.main

# Run the LIFE regression suite (507 tests, ~5 min).
test-life:
	cd life && $(LIFE_PY) -m pytest tests/ -q

dev-agent:
	cd agent && npm run dev

# Install Go dependencies
deps-go:
	cd core && go mod tidy
	cd mocr && go mod tidy

# Install Python dependencies (falls back to uv when the venv has no pip)
deps-python:
	cd life && ($(LIFE_PY) -m pip install -e ".[dev]" || uv pip install -e ".[dev]")

# Install Node.js dependencies
deps-node:
	cd agent && npm install
