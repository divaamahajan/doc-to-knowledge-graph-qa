#!/usr/bin/env bash
set -e  # Exit immediately on error

# Create virtual environment if not present
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Check if virtual env is active
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Error: Virtual environment not activated!"
    exit 1
fi

# Install dependencies
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo "Error: requirements.txt not found!"
    exit 1
fi

# Run the FastAPI server
echo "Starting FastAPI server..."
uvicorn main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload \
    --reload-dir .
