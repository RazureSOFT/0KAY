FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy protobuf generated code
COPY gen/python/ ./gen/python/

# Copy L.I.F.E source
COPY life/ ./life/

# Install Python dependencies
WORKDIR /app/life
RUN pip install --no-cache-dir -e .

# Runtime
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy source
COPY --from=builder /app/gen/python/ ./gen/python/
COPY --from=builder /app/life/ ./life/

# Create data directory
RUN mkdir -p /app/data/life/memory \
    && groupadd --system --gid 10001 life \
    && useradd --system --uid 10001 --gid life --home-dir /app --no-create-home life \
    && chown -R life:life /app

EXPOSE 50053
ENV PROTO_PYTHON_DIR=/app/gen/python

# Run as an unprivileged user: the process parses untrusted RSS/HTML/media and
# opens network connections, so it must not be root inside the container.
USER life

CMD ["python", "-m", "life.main"]
