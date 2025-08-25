#!/bin/bash

echo "🧪 Running Enhanced Knowledge Graph Tests..."
echo "============================================="

# Activate virtual environment
source .venv/bin/activate

# Change to backend directory
cd backend

echo "📁 Current directory: $(pwd)"
echo "🐍 Python version: $(python3 --version)"
echo "📦 Virtual environment: $VIRTUAL_ENV"

echo ""
echo "🔍 Running tests for enhanced knowledge graph functionality..."
echo ""

# Run the specific test file
python3 -m pytest tests/test_knowledge_graph_enhanced.py -v

echo ""
echo "✅ Tests completed!"
echo ""

# Deactivate virtual environment
deactivate
