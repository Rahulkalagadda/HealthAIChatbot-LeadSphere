# Stage 1: Builder
FROM python:3.10.12-slim AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system build dependencies
# gcc and libpq-dev are needed for psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies (handles both root context and backend folder context)
COPY requirements.txt* backend/requirements.txt* /app/
RUN if [ -f /app/backend/requirements.txt ]; then mv /app/backend/requirements.txt /app/requirements.txt; fi

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# Stage 2: Runtime
FROM python:3.10.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    PYTHONPATH="/app:/app/backend:$PYTHONPATH"

WORKDIR /app

# Install ONLY runtime dependencies
# libpq5 for psycopg2, tesseract-ocr for pytesseract
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy the backend project files
COPY . /app/

# Expose the default port
EXPOSE 8000

# Bind to dynamic Railway $PORT with fallback to 8000 (resolves app.main in /app or /app/backend)
CMD ["sh", "-c", "if [ -d /app/backend/app ]; then cd /app/backend; fi && gunicorn --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} app.main:app"]
