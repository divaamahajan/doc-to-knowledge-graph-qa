# Dockerfile
FROM python:3.11-slim

# Set workdir
WORKDIR /app

COPY requirements.txt .
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy files
COPY ./ /app/
# Expose port
EXPOSE 8000

# Run FastAPI app
#removed /app/backend from the very last revert if doesnt suit well
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/app/backend"]

