
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for WireGuard and PostgreSQL
RUN apt-get update && apt-get install -y \
    wireguard-tools \
    iproute2 \
    procps \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure the backend app is in the python path
ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
