# 🚀 Document to Knowledge Graph Q&A - Backend

> **High-performance, scalable backend for transforming documents into intelligent knowledge graphs with AI-powered Q&A**

[![Python](https://img.shields.io/badge/python-3.9+-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116.1-green)](https://fastapi.tiangolo.com)
[![Neo4j](https://img.shields.io/badge/Neo4j-5.28.2-orange)](https://neo4j.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.14+-green)](https://mongodb.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 **Backend Overview**

The Document to Knowledge Graph Q&A backend is a **high-performance, microservices-based architecture** that transforms unstructured documents into intelligent, queryable knowledge graphs. Built with FastAPI, Neo4j, and MongoDB, it provides:

- **Real-time document processing** with intelligent text extraction
- **Semantic knowledge graph construction** using advanced NLP techniques
- **AI-powered question answering** with Claude AI integration
- **Graph traversal and evidence visualization** for complete transparency
- **Scalable vector search** with Neo4j vector indexing
- **Multi-format document support** (TXT, PDF, images, URLs)

---

## 🏗️ **Architecture & Design**

### **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI App  │    │   Neo4j Graph   │    │   MongoDB Doc   │
│   (Main API)   │◄──►│   (Knowledge)   │◄──►│   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File Handler   │    │  Vector Search  │    │  Claude AI      │
│  (Ingestion)    │    │  (Embeddings)   │    │  (Reasoning)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Core Components**

**1. API Layer (FastAPI)**
- **RESTful endpoints** for all operations
- **Async request handling** for high concurrency
- **Automatic API documentation** with OpenAPI/Swagger
- **Middleware support** for authentication, CORS, and logging

**2. Knowledge Graph Engine (Neo4j)**
- **Graph data model** for concept relationships
- **Vector similarity search** for semantic retrieval
- **Relationship mapping** between documents, chunks, and concepts
- **Real-time graph traversal** for evidence paths

**3. Document Processing Pipeline**
- **Multi-format ingestion** (TXT, PDF, images, URLs)
- **Intelligent text extraction** with OCR support
- **Semantic chunking** for meaningful content segmentation
- **Metadata preservation** and source tracking

**4. AI Integration Layer**
- **Claude AI integration** for advanced reasoning
- **OpenAI embeddings** for semantic vectorization
- **LangChain orchestration** for AI workflow management
- **Context aggregation** from multiple sources

---

## 🛠️ **Technology Stack**

### **Core Framework**
- **FastAPI 0.116.1**: High-performance async web framework
- **Uvicorn 0.35.0**: ASGI server for production deployment
- **Pydantic 2.11.7**: Data validation and serialization
- **Starlette 0.47.2**: ASGI framework for web services

### **Database & Storage**
- **Neo4j 5.28.2**: Graph database for knowledge relationships
- **MongoDB 4.14.0**: Document storage with GridFS support
- **Motor 3.7.1**: Async MongoDB driver
- **PyMongo 4.14.0**: MongoDB Python driver

### **AI & Machine Learning**
- **Anthropic 0.64.0**: Claude AI integration for reasoning
- **OpenAI 1.99.9**: Text embeddings and vectorization
- **LangChain 0.3.27**: AI workflow orchestration
- **LangChain Neo4j 0.5.0**: Graph-aware AI operations
- **LangChain OpenAI 0.3.30**: OpenAI integration
- **LangChain Text Splitters 0.3.9**: Intelligent text chunking

### **Document Processing**
- **PyMuPDF 1.26.3**: PDF text extraction and processing
- **Pillow 11.3.0**: Image processing and manipulation
- **Pytesseract 0.3.13**: OCR for image text extraction
- **BeautifulSoup4 4.13.4**: Web scraping and HTML parsing
- **Requests 2.32.4**: HTTP client for URL ingestion

### **Authentication & Security**
- **Authlib 1.6.1**: OAuth2 authentication
- **Python-Jose 3.5.0**: JWT token handling
- **Google Auth 2.40.3**: Google OAuth integration

### **Communication & Notifications**
- **Discord.py 2.5.2**: Discord bot integration
- **HTTPx 0.28.1**: Modern HTTP client

### **Utilities**
- **Tqdm 4.67.1**: Progress bars for long operations
- **NumPy 2.0.2**: Numerical computations
- **Python-dotenv 1.1.1**: Environment variable management
- **Python-multipart 0.0.20**: File upload handling

---

## 📁 **Project Structure**

```
backend/
├── main.py                      # FastAPI application entry point
├── environment.py               # Environment configuration and constants
├── logger.py                    # Logging configuration
├── requirements.txt             # Python dependencies 
├── Dockerfile                   # Container configuration
├── docker-compose.yaml          # Multi-service orchestration
├── run.sh                       # Development startup script
│
├── routers/                     # API route definitions
│   ├── __init__.py
│   ├── auth.py                  # Authentication endpoints (Google OAuth)
│   ├── chat.py                  # Chat and conversation APIs
│   ├── crud.py                  # CRUD operations for data management
│   ├── file_handler.py          # File upload/download operations
│   ├── knowledge_graph.py       # Core KG operations & Q&A endpoints
│   ├── notify.py                # Discord notification system
│   └── ping.py                  # Health check endpoints
│
├── models/                      # Data models and schemas
│   ├── __init__.py
│   ├── chat_models.py           # Chat-related data models
│   └── crud_models.py           # CRUD operation models
│
├── services/                    # Business logic services
│   ├── __init__.py
│   └── file_service.py          # File processing service
│
├── utils/                       # Utility functions and helpers
│   ├── __init__.py
│   ├── extract_text_from_image.py    # Image OCR processing
│   ├── extract_text_from_pdf.py      # PDF text extraction
│   ├── knowledge_graph.py            # Core KG operations
│   └── url_extractor.py              # Web scraping utilities
│
├── database/                    # Database connection and models
│   ├── __init__.py
│   └── mongo.py                 # MongoDB connection management
│
└── tests/                       # Test suite
    ├── __init__.py
    ├── test_*.py                # Individual test files
    └── tests/
        ├── test_knowledge_graph_enhanced.py
        └── test_url_ingestion.py
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- **Python 3.9+** (3.13+ recommended)
- **Neo4j 5.x** (local or cloud instance)
- **MongoDB 4.x** (local or cloud instance)
- **Claude AI API key**
- **OpenAI API key**

### **Environment Setup**

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd doc-to-knowledge-graph-qa/backend

# 2. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables
cp .env.example .env
# Edit .env with your API keys and database URLs
```

### **Environment Variables**

Create a `.env` file with the following variables:

```bash
# Database Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASS=your_password

MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=doc_to_kg_qa

# AI API Keys
CLAUDE_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET_KEY=your_session_secret

# Application Settings
FRONTEND_URL=http://localhost:3000
PROJECT_NAME=doc-to-kg-qa
ENV=development

# Discord Bot (Optional)
DISCORD_BOT_TOKEN=your_discord_bot_token
```

### **Database Setup**

```bash
# Start Neo4j (using Docker)
docker run \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/your_password \
  -e NEO4J_PLUGINS='["graph-data-science"]' \
  neo4j:5.28.2

# Start MongoDB (using Docker)
docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=changeme \
  mongo:4.14.0
```

### **Start the Application**

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Using the provided script
./run.sh
```

---

## 🔌 **API Endpoints**

### **Core Knowledge Graph Operations**

#### **Document Ingestion**
```http
POST /knowledge-graph/upload
Content-Type: multipart/form-data
# Upload file for processing

POST /knowledge-graph/url-upload?url={url}
# Upload content from URL

GET /knowledge-graph/files
# List all uploaded files

DELETE /knowledge-graph/files/{filename}
# Delete specific file and its knowledge graph
```

#### **Question Answering**
```http
POST /knowledge-graph/qa?question={question}&filenames={filename1,filename2}
# Ask questions against knowledge graph

GET /knowledge-graph/graph-traversal
# Get graph traversal path for evidence visualization
```

#### **File Management**
```http
GET /file-handler/files
# List files with metadata

POST /file-handler/upload
# Upload files to storage

GET /file-handler/download/{filename}
# Download specific file

DELETE /file-handler/files/{filename}
# Delete file from storage
```

#### **Authentication**
```http
GET /auth/google
# Initiate Google OAuth flow

GET /auth/google/callback
# Google OAuth callback

POST /auth/google/verify
# Verify Google ID token
```

#### **Health & Status**
```http
GET /ping
# Basic health check

GET /notify/discord/info
# Discord notification info
```

### **API Response Format**

```json
{
  "status": "success",
  "data": {
    "answer": "AI-generated response based on your documents",
    "question": "Original user question",
    "sources": [
      {
        "filename": "document.pdf",
        "section": "section_name",
        "chunk_index": 5,
        "chunk_id": "unique_chunk_id",
        "user_id": "user_identifier"
      }
    ],
    "total_sources": 3,
    "traversal_path": {
      "nodes": [...],
      "edges": [...],
      "metadata": {
        "total_nodes": 15,
        "total_edges": 23,
        "files_involved": ["doc1.pdf", "doc2.txt"]
      }
    }
  }
}
```

---

## 🧠 **Knowledge Graph Architecture**

### **Data Model**

```
(User)-[:UPLOADED]->(File)-[:HAS_CHUNK]->(Chunk)
(Chunk)-[:NEXT]->(Chunk)
(Chunk)-[:SIMILAR_TO]->(Chunk)
```

### **Node Properties**

**User Node:**
```cypher
CREATE (u:User {
  user_id: String,
  name: String,
  email: String,
  created_date: DateTime,
  last_activity: DateTime
})
```

**File Node:**
```cypher
CREATE (f:File {
  filename: String,
  user_id: String,
  source: String,
  total_chunks: Integer,
  processed_date: DateTime,
  pages_processed: Integer,
  images_processed: Integer,
  successful_ocr: Integer,
  failed_ocr: Integer,
  extraction_errors: Integer
})
```

**Chunk Node:**
```cypher
CREATE (c:Chunk {
  id: String,
  user_id: String,
  filename: String,
  text: String,
  chunk_index: Integer,
  section: String,
  length: Integer,
  textEmbedding: Vector
})
```

### **Vector Indexing**

```cypher
// Create vector index for semantic search
CREATE VECTOR INDEX pdf_chunks IF NOT EXISTS
FOR (c:Chunk) ON (c.textEmbedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1536,
    `vector.similarity_function`: 'cosine'
  }
}
```

---

## 🔄 **Document Processing Pipeline**

### **1. Ingestion Phase**
```
Document Input → Format Detection → Text Extraction → 
Size Validation → Metadata Extraction
```

**Supported Formats:**
- **TXT**: Direct text processing
- **PDF**: PyMuPDF extraction with OCR fallback
- **Images**: Tesseract OCR processing (PNG, JPG, JPEG, TIFF, BMP, GIF)
- **URLs**: BeautifulSoup web scraping

### **2. Processing Phase**
```
Raw Text → Cleaning → Semantic Chunking → 
Vector Embedding → Graph Node Creation
```

**Chunking Strategy:**
- **Size**: 2000 characters per chunk
- **Overlap**: 400 characters between chunks
- **Separators**: Paragraphs, sentences, words
- **Semantic preservation**: Maintain context boundaries

### **3. Storage Phase**
```
Processed Chunks → Neo4j Graph Storage → 
MongoDB Document Storage → Vector Index Creation
```

**Storage Optimization:**
- **Graph relationships** in Neo4j
- **Large documents** in MongoDB GridFS
- **Vector embeddings** in Neo4j vector index
- **User isolation** ensuring data privacy

---

## 🤖 **AI Integration**

### **Claude AI Integration**

The system uses Claude AI (Anthropic) for sophisticated reasoning and question answering:

```python
class ClaudeQASystem:
    def __init__(self, retriever):
        self.client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    
    def invoke(self, question_dict):
        # Retrieve relevant documents
        docs = self.retriever.get_relevant_documents(question)
        
        # Build context from retrieved documents
        context = self._build_context(docs)
        
        # Generate response with Claude
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}]
        )
        
        return {
            "answer": response.content[0].text,
            "source_documents": docs
        }
```

### **Vector Search & Retrieval**

User-scoped semantic search with Neo4j:

```python
def setup_qa_system(user_id, filenames=None):
    # Build retrieval query with user-based access control
    retrieval_query = f"""
    MATCH (u:User {{user_id: '{user_id}'}})-[:UPLOADED]->(f:File)-[:HAS_CHUNK]->(c:Chunk)
    WHERE c.textEmbedding IS NOT NULL {file_filter}
    WITH f, c, gds.similarity.cosine(c.textEmbedding, $embedding) AS score
    WHERE score > 0.7
    ORDER BY score DESC
    LIMIT 5
    RETURN c.text, score, metadata
    """
    
    vector_store = Neo4jVector.from_existing_index(
        embedding=OpenAIEmbeddings(),
        url=NEO4J_URI,
        username=NEO4J_USER,
        password=NEO4J_PASS,
        index_name="pdf_chunks",
        retrieval_query=retrieval_query
    )
    
    return ClaudeQASystem(vector_store.as_retriever())
```

---

## 🔒 **Security & Authentication**

### **Authentication Flow**

1. User initiates OAuth2 flow with Google
2. Google returns authorization code
3. Backend exchanges code for access token
4. Backend creates JWT session token
5. User authenticated for subsequent requests

### **Security Features**

**Data Protection:**
- **JWT token authentication** for API access
- **OAuth2 integration** with Google
- **User isolation** - users can only access their own data
- **Input validation** with Pydantic models
- **Parameterized queries** to prevent injection attacks

**API Security:**
- **CORS configuration** for frontend integration
- **Request validation** with automatic error handling
- **Secure headers** with security middleware

---

## 🧪 **Testing & Quality Assurance**

### **Running Tests**

```bash
# Run all tests
python -m pytest

# Run specific test files
python -m pytest tests/test_knowledge_graph_enhanced.py -v

# Run with coverage
python -m pytest --cov=utils --cov=routers --cov-report=html

# Test only without Neo4j dependencies
python -m pytest tests/ -k "not neo4j"
```

### **Available Tests**

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **URL Processing**: Web scraping functionality
- **Knowledge Graph**: Core KG operations
- **File Upload**: Document processing pipeline

---

## 🚀 **Deployment**

### **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment-Specific Configs**

**Development:**
```bash
ENV=development
LOG_LEVEL=DEBUG
DEBUG=true
```

**Production:**
```bash
ENV=production
LOG_LEVEL=INFO
DEBUG=false
WORKERS=4
```

### **Health Checks**

```bash
# Application health
curl http://localhost:8000/ping

# API documentation
curl http://localhost:8000/docs
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**1. Neo4j Connection Issues**
```bash
# Check Neo4j status
docker ps | grep neo4j

# Test connection
python -c "from neo4j import GraphDatabase; print('Neo4j connection test')"
```

**2. MongoDB Connection Issues**
```bash
# Check MongoDB status
docker ps | grep mongodb

# Test connection
python -c "from pymongo import MongoClient; print('MongoDB connection test')"
```

**3. AI API Issues**
```bash
# Verify API keys in environment
python -c "import os; print('Claude:', bool(os.getenv('CLAUDE_API_KEY'))); print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"
```

**4. Dependency Issues**
```bash
# Reinstall cleaned dependencies
pip install -r requirements.txt --force-reinstall

# Check for conflicts
pip check
```

### **Debug Mode**

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
export DEBUG=true

# Start with verbose output
uvicorn main:app --reload --log-level debug
```

---

## 🤝 **Contributing**

### **Development Setup**

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/doc-to-knowledge-graph-qa.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Install dependencies
cd backend
pip install -r requirements.txt

# 4. Make changes and test
python -m pytest tests/
python -m flake8 .

# 5. Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### **Code Standards**

**Python Code Style:**
- **PEP 8**: Python style guide compliance
- **Type hints**: Use type annotations where appropriate
- **Docstrings**: Document functions and classes
- **Error handling**: Proper exception management

---

## 📚 **Additional Resources**

### **Documentation**
- **API Reference**: `http://localhost:8000/docs` (Swagger UI)
- **ReDoc**: `http://localhost:8000/redoc` (Alternative API docs)
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

### **Dependencies**
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Neo4j**: [neo4j.com/docs](https://neo4j.com/docs)
- **LangChain**: [langchain.readthedocs.io](https://langchain.readthedocs.io)
- **Claude AI**: [docs.anthropic.com](https://docs.anthropic.com)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **FastAPI** for the excellent web framework
- **Neo4j** for powerful graph database capabilities
- **Claude AI** for advanced reasoning capabilities
- **LangChain** for AI workflow orchestration
- **OpenAI** for text embedding technology