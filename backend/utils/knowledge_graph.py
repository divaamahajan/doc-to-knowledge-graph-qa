import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_neo4j import Neo4jGraph
from langchain_community.vectorstores import Neo4jVector
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQAWithSourcesChain
from langchain_openai import ChatOpenAI
from environment import NEO4J_URI, NEO4J_USER, NEO4J_PASS, CLAUDE_API_KEY
import anthropic
import logging
from tqdm import tqdm
from utils.extract_text_from_pdf import extract_text_from_pdf
from utils.extract_text_from_image import extract_text_from_image


# Set up logging with minimal verbosity
logging.basicConfig(level=logging.ERROR)
# Suppress all HTTP logs
logging.getLogger("openai").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)
logging.getLogger("httpcore").setLevel(logging.ERROR)
logging.getLogger("neo4j").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

# Constants
VECTOR_INDEX_NAME = 'pdf_chunks'
VECTOR_NODE_LABEL = 'Chunk'
VECTOR_SOURCE_PROPERTY = 'text'
VECTOR_EMBEDDING_PROPERTY = 'textEmbedding'



# Neo4j connection (lazy-loaded)
kg = None

def get_neo4j_connection():
    """Get Neo4j connection with lazy loading and error handling"""
    global kg
    if kg is None:
        try:
            if not NEO4J_URI or not NEO4J_USER or not NEO4J_PASS:
                logger.warning("Neo4j credentials not provided. Knowledge graph features will be disabled.")
                return None
            
            kg = Neo4jGraph(url=NEO4J_URI, username=NEO4J_USER, password=NEO4J_PASS)
            logger.info("Neo4j connection established successfully")
            return kg
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            logger.warning("Knowledge graph features will be disabled. Please check Neo4j configuration.")
            return None
    return kg

def safe_kg_query(query, params=None):
    """Execute Neo4j query with error handling"""
    kg = get_neo4j_connection()
    if kg is None:
        return []
    
    try:
        return kg.query(query, params=params or {})
    except Exception as e:
        logger.error(f"Neo4j query failed: {e}")
        return []

def neo4j_available():
    """Check if Neo4j is available"""
    return get_neo4j_connection() is not None



def ensure_constraints():
    """Create necessary unique constraints once"""
    if not neo4j_available():
        return False
    
    constraints = {
        "unique_user": "CREATE CONSTRAINT unique_user IF NOT EXISTS FOR (u:User) REQUIRE u.user_id IS UNIQUE",
        "unique_chunk": "CREATE CONSTRAINT unique_chunk IF NOT EXISTS FOR (c:Chunk) REQUIRE c.id IS UNIQUE"
    }
    for name, query in constraints.items():
        safe_kg_query(query)
    return True

def split_text(text, chunk_size=2000, chunk_overlap=400):
    """Split text into intelligently sized chunks"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
        length_function=len
    )
    return splitter.split_text(text)



def create_or_get_user(user_id, name=None, email=None):
    if not neo4j_available():
        logger.warning("Neo4j unavailable. User creation skipped.")
        return user_id
    
    if not ensure_constraints():
        return user_id
    
    safe_kg_query("""
        MERGE (u:User {user_id: $user_id})
        SET u.name = COALESCE($name, u.name),
            u.email = COALESCE($email, u.email),
            u.created_date = COALESCE(u.created_date, datetime()),
            u.last_activity = datetime()
    """, params={'user_id': user_id, 'name': name, 'email': email})
    return user_id

def remove_existing_file_nodes(filename, user_id):
    """Clear existing data only for a specific user's file and its relationships"""
    try:
        # Clear chunks and file node with all relationships for specific user
        kg.query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File {filename: $filename})
            OPTIONAL MATCH (f)-[:HAS_CHUNK]->(c:Chunk)
            DETACH DELETE f, c
        """, params={'filename': filename, 'user_id': user_id})
    except Exception as e:
        print(f"Error clearing existing data for {filename}: {e}")
        exit(1)

def _delete_file_or_chunks(filename=None, user_id=None):
    """Generic deletion of a file and/or its chunks for a user"""
    if not filename and not user_id:
        return
    params = {'filename': filename, 'user_id': user_id}
    query = """
        MATCH (u:User {user_id: $user_id})
        OPTIONAL MATCH (u)-[:UPLOADED]->(f:File {filename: $filename})
        OPTIONAL MATCH (f)-[:HAS_CHUNK]->(c:Chunk)
        DETACH DELETE f, c
    """
    kg.query(query, params=params)



def delete_user(user_id):
    """Delete a user and all associated files/chunks"""
    try:
        result = kg.query("""
            MATCH (u:User {user_id: $user_id})
            OPTIONAL MATCH (u)-[:UPLOADED]->(f:File)
            OPTIONAL MATCH (f)-[:HAS_CHUNK]->(c:Chunk)
            RETURN u.user_id AS user_id, u.name AS name,
                   COUNT(DISTINCT f) AS total_files,
                   COUNT(DISTINCT c) AS total_chunks
        """, params={'user_id': user_id})
        if not result or not result[0]['user_id']:
            print(f"User '{user_id}' not found")
            return False
        _delete_file_or_chunks(user_id=user_id)
        info = result[0]
        print(f"Deleted user '{user_id}' ({info['name'] or 'No name'}), "
              f"{info['total_files']} files, {info['total_chunks']} chunks")
        return True
    except Exception as e:
        print(f"Error deleting user {user_id}: {e}")
        return False


def delete_file_knowledge_graph(filename, user_id):
    """Delete a specific file and all its associated data for a user"""
    try:
        # Check if file exists for this user
        result = kg.query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File {filename: $filename})
            RETURN f.filename AS filename, f.total_chunks AS chunks
        """, params={'filename': filename, 'user_id': user_id})

        if not result:
            print(f"File '{filename}' not found for user '{user_id}'")
            return False

        file_info = result[0]

        # Delete file and all its chunks with relationships
        kg.query("""
            MATCH (u:User {user_id: $user_id})-[:UPLOADED]->(f:File {filename: $filename})
            OPTIONAL MATCH (f)-[:HAS_CHUNK]->(c:Chunk)
            DETACH DELETE f, c
        """, params={'filename': filename, 'user_id': user_id})

        print(f"Successfully deleted file '{filename}' and {file_info['chunks']} chunks for user '{user_id}'")
        return True

    except Exception as e:
        print(f"Error deleting file {filename} for user {user_id}: {e}")
        return False

def create_or_update_file_node(filename, user_id, chunks, metadata):
    """Create or update File node and its relationship with the user"""
    ensure_constraints()
    
    # Use safe queries instead of direct kg access
    params = {
        'user_id': user_id, 'filename': filename, 'source': filename,
        'total_chunks': len(chunks), 'metadata': metadata
    }
    safe_kg_query("""
        MERGE (f:File {user_id: $user_id, filename: $filename})
        SET f.source = $source,
            f.processed_date = datetime(),
            f.total_chunks = $total_chunks,
            f.pages_processed = $metadata.pages_processed,
            f.images_processed = $metadata.images_processed,
            f.successful_ocr = $metadata.successful_ocr,
            f.failed_ocr = $metadata.failed_ocr,
            f.extraction_errors = $metadata.extraction_errors,
            f.original_url = $metadata.original_url
    """, params=params)
    safe_kg_query("""
        MATCH (u:User {user_id: $user_id})
        MATCH (f:File {user_id: $user_id, filename: $filename})
        MERGE (u)-[:UPLOADED]->(f)
    """, params={'user_id': user_id, 'filename': filename})
    # Remove existing chunks
    safe_kg_query("""
        MATCH (f:File {user_id: $user_id, filename: $filename})-[:HAS_CHUNK]->(c:Chunk)
        DETACH DELETE c
    """, params={'user_id': user_id, 'filename': filename})


def store_chunks(chunks, filename, user_id):
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        params = [{
            'id': f'{user_id}_{filename}_chunk_{i+j}',
            'text': chunk,
            'chunk_index': i+j,
            'section': f'{user_id}_{filename}_section_{(i+j)//10}',
            'length': len(chunk),
            'user_id': user_id,
            'filename': filename
        } for j, chunk in enumerate(batch)]
        safe_kg_query("""
            MATCH (f:File {user_id: $user_id, filename: $filename})
            UNWIND $params AS param
            CREATE (c:Chunk {id: param.id})
            SET c.text = param.text,
                c.chunk_index = param.chunk_index,
                c.section = param.section,
                c.length = param.length,
                c.user_id = param.user_id,
                c.filename = param.filename
            MERGE (f)-[:HAS_CHUNK]->(c)
        """, params={'params': params, 'user_id': user_id, 'filename': filename})


def _process_text_file(text, filename, user_id, metadata):
    """Handles splitting text, storing chunks, creating relationships, embeddings"""
    chunks = split_text(text)
    create_or_update_file_node(filename, user_id, chunks, metadata)
    store_chunks(chunks, filename, user_id)
    create_chunk_relationships(filename)
    create_vector_index_and_embeddings(filename)
    return len(chunks)


def create_chunk_relationships(filename=None):
    query = """
        MATCH (f:File{filename:$filename})-[:HAS_CHUNK]->(c1:Chunk),
              (f)-[:HAS_CHUNK]->(c2:Chunk)
        WHERE c1.chunk_index = c2.chunk_index - 1
        MERGE (c1)-[:NEXT]->(c2)
    """ if filename else """
        MATCH (f:File)-[:HAS_CHUNK]->(c1:Chunk),
              (f)-[:HAS_CHUNK]->(c2:Chunk)
        WHERE c1.chunk_index = c2.chunk_index - 1
        MERGE (c1)-[:NEXT]->(c2)
    """
    safe_kg_query(query, params={'filename': filename} if filename else {})


def create_graph_and_store_chunks(chunks, filename, user_id, extraction_metadata):
    try:
        # Create constraints (suppress notifications)
        try:
            kg.query("CREATE CONSTRAINT unique_chunk IF NOT EXISTS FOR (c:Chunk) REQUIRE c.id IS UNIQUE")
        except Exception:
            pass  # Constraint already exists

        # Create or update File node with user_id
        kg.query("""
            MERGE (f:File {user_id: $user_id, filename: $filename})
            ON CREATE SET 
                f.source = $source,
                f.processed_date = datetime(),
                f.total_chunks = $total_chunks,
                f.pages_processed = $metadata.pages_processed,
                f.images_processed = $metadata.images_processed,
                f.successful_ocr = $metadata.successful_ocr,
                f.failed_ocr = $metadata.failed_ocr,
                f.extraction_errors = $metadata.extraction_errors
            ON MATCH SET
                f.source = $source,
                f.processed_date = datetime(),
                f.total_chunks = $total_chunks,
                f.pages_processed = $metadata.pages_processed,
                f.images_processed = $metadata.images_processed,
                f.successful_ocr = $metadata.successful_ocr,
                f.failed_ocr = $metadata.failed_ocr,
                f.extraction_errors = $metadata.extraction_errors
        """, params={
            'user_id': user_id,
            'filename': filename,
            'source': filename,
            'total_chunks': len(chunks),
            'metadata': extraction_metadata
        })


        # Create User-UPLOADED->File relationship
        kg.query("""
            MATCH (u:User {user_id: $user_id})
            MATCH (f:File {user_id: $user_id, filename: $filename})
            MERGE (u)-[:UPLOADED]->(f)
        """, params={'user_id': user_id, 'filename': filename})
        # Delete existing chunks for this file (if any)
        kg.query("""
            MATCH (f:File {user_id: $user_id, filename: $filename})-[:HAS_CHUNK]->(c:Chunk)
            DETACH DELETE c
        """, params={'user_id': user_id, 'filename': filename})

        batch_size = 50
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            # Enhanced metadata with user and filename-based IDs
            params = [{
                'id': f'{user_id}_{filename}_chunk_{i+j}',
                'text': chunk,
                'chunk_index': i+j,
                'section': f'{user_id}_{filename}_section_{(i+j) // 10}',
                'length': len(chunk),
                'user_id': user_id,
                'filename': filename
            } for j, chunk in enumerate(batch)]

            # Create chunks and establish relationships with File node
            kg.query(
                """
                MATCH (f:File {user_id: $user_id, filename: $filename})
                UNWIND $params AS param
                CREATE (c:Chunk {id: param.id})
                SET c.text = param.text,
                    c.chunk_index = param.chunk_index,
                    c.section = param.section,
                    c.length = param.length,
                    c.user_id = param.user_id,
                    c.filename = param.filename
                MERGE (f)-[:HAS_CHUNK]->(c)
                """,
                params={'params': params, 'user_id': user_id, 'filename': filename}
            )

        print(f"Stored {len(chunks)} chunks for {filename}")
    except Exception as e:
        print(f"Error creating graph and storing chunks: {e}")
        raise  # Re-raise the exception to be caught in the calling function

def create_chunk_relationships(filename=None):
    """Create NEXT relationships between sequential chunks in the same file"""
    try:
        if not neo4j_available():
            print("Neo4j not available. Skipping chunk relationships.")
            return
            
        if filename:
            query = """
            MATCH (f:File {filename: $filename})-[:HAS_CHUNK]->(c1:Chunk)
            MATCH (f)-[:HAS_CHUNK]->(c2:Chunk)
            WHERE c1.chunk_index = c2.chunk_index - 1
            MERGE (c1)-[:NEXT]->(c2)
            """
            safe_kg_query(query, params={'filename': filename})
        else:
            query = """
            MATCH (f:File)-[:HAS_CHUNK]->(c1:Chunk)
            MATCH (f)-[:HAS_CHUNK]->(c2:Chunk)
            WHERE c1.chunk_index = c2.chunk_index - 1
            MERGE (c1)-[:NEXT]->(c2)
            """
            safe_kg_query(query)
    except Exception as e:
        print(f"Error creating chunk relationships: {e}")

def create_vector_index_and_embeddings(filename=None):
    try:
        # Check if OpenAI API key is available
        from environment import OPENAI_API_KEY
        if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
            print(f"OpenAI API key not available. Skipping embeddings for {filename or 'all files'}")
            return
        
        # Check if Neo4j is available
        if not neo4j_available():
            print(f"Neo4j not available. Skipping embeddings for {filename or 'all files'}")
            return
            
        kg = get_neo4j_connection()
        if kg is None:
            print(f"Cannot connect to Neo4j. Skipping embeddings for {filename or 'all files'}")
            return

        # Create vector index
        safe_kg_query(f"""
        CREATE VECTOR INDEX {VECTOR_INDEX_NAME} IF NOT EXISTS
        FOR (c:{VECTOR_NODE_LABEL}) ON (c.{VECTOR_EMBEDDING_PROPERTY})
        OPTIONS {{
            indexConfig: {{
                `vector.dimensions`: 1536,
                `vector.similarity_function`: 'cosine'
            }}
        }}
        """)

        try:
            embeddings = OpenAIEmbeddings()
            
            # Only process chunks for specific file if filename provided, otherwise all chunks
            if filename:
                chunks = safe_kg_query("""
                    MATCH (f:File {filename: $filename})-[:HAS_CHUNK]->(c:Chunk)
                    WHERE c.textEmbedding IS NULL 
                    RETURN c.id AS id, c.text AS text, f.filename AS filename
                """, params={'filename': filename})
            else:
                chunks = safe_kg_query("""
                    MATCH (f:File)-[:HAS_CHUNK]->(c:Chunk)
                    WHERE c.textEmbedding IS NULL 
                    RETURN c.id AS id, c.text AS text, f.filename AS filename
                """)

            if chunks:
                for chunk in tqdm(chunks, desc="Generating embedding", unit="chunk"):
                    embedding_vector = embeddings.embed_query(chunk['text'])
                    safe_kg_query(
                        "MATCH (c:Chunk {id: $id}) SET c.textEmbedding = $embedding",
                        params={'id': chunk['id'], 'embedding': embedding_vector}
                    )

                if filename:
                    print(f"Vector index and embeddings created/updated successfully for {filename}")
                else:
                    print("Vector index and embeddings created/updated successfully for all files")
            else:
                print(f"No chunks found to create embeddings for {filename or 'all files'}")
                
        except Exception as e:
            print(f"Error creating embeddings (continuing without embeddings): {e}")
            # Don't exit, continue without embeddings
            
    except Exception as e:
        print(f"Error creating vector index and embeddings: {e}")
        # Don't exit, continue without embeddings

def regenerate_all_embeddings(force=False):
    """Force regenerate embeddings for all chunks, useful for fixing search bias"""
    try:
        # Check if OpenAI API key is available
        from environment import OPENAI_API_KEY
        if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
            print("OpenAI API key not available. Cannot regenerate embeddings")
            return False
        
        # Check if Neo4j is available
        if not neo4j_available():
            print("Neo4j not available. Cannot regenerate embeddings")
            return False
            
        kg = get_neo4j_connection()
        if kg is None:
            print("Cannot connect to Neo4j. Cannot regenerate embeddings")
            return False

        try:
            embeddings = OpenAIEmbeddings()
            
            # Get all chunks (regardless of whether they have embeddings)
            if force:
                chunks = safe_kg_query("""
                    MATCH (f:File)-[:HAS_CHUNK]->(c:Chunk)
                    RETURN c.id AS id, c.text AS text, f.filename AS filename
                """)
            else:
                chunks = safe_kg_query("""
                    MATCH (f:File)-[:HAS_CHUNK]->(c:Chunk)
                    WHERE c.textEmbedding IS NULL 
                    RETURN c.id AS id, c.text AS text, f.filename AS filename
                """)

            if chunks:
                print(f"Generating embeddings for {len(chunks)} chunks...")
                for chunk in tqdm(chunks, desc="Regenerating embeddings", unit="chunk"):
                    embedding_vector = embeddings.embed_query(chunk['text'])
                    safe_kg_query(
                        "MATCH (c:Chunk {id: $id}) SET c.textEmbedding = $embedding",
                        params={'id': chunk['id'], 'embedding': embedding_vector}
                    )

                print(f"Successfully regenerated embeddings for {len(chunks)} chunks")
                return True
            else:
                print("No chunks found to regenerate embeddings")
                return False
                
        except Exception as e:
            print(f"Error regenerating embeddings: {e}")
            return False
            
    except Exception as e:
        print(f"Error in regenerate_all_embeddings: {e}")
        return False

def visualize_graph_structure():
    files_info = kg.query("""
        MATCH (f:File)
        OPTIONAL MATCH (f)-[:HAS_CHUNK]->(c:Chunk)
        RETURN f.filename AS filename, 
               f.source AS source,
               f.processed_date AS processed_date,
               f.total_chunks AS total_chunks,
               count(c) AS actual_chunks,
               f.pages_processed AS pages,
               f.images_processed AS images,
               f.successful_ocr AS ocr_success,
               f.failed_ocr AS ocr_failed
        ORDER BY f.filename
    """)

    print("\n=== GRAPH STRUCTURE ===")
    for file_info in files_info:
        print(f"\nFile: {file_info['filename']}")
        print(f"  Source: {file_info['source']}")
        print(f"  Processed: {file_info['processed_date']}")
        print(f"  Pages: {file_info['pages']}")
        print(f"  Images: {file_info['images']}")
        print(f"  OCR Success/Failed: {file_info['ocr_success']}/{file_info['ocr_failed']}")
        print(f"  Chunks: {file_info['actual_chunks']}/{file_info['total_chunks']}")

def setup_qa_system(user_id, filenames=None):
    try:
        # Build filename filter for the query
        if filenames:
            filenames_str = ', '.join([f'"{f}"' for f in filenames])
            file_filter = f"AND f.filename IN [{filenames_str}]"
        else:
            file_filter = ""

        # Enhanced retrieval query with user-based access control (direct substitution)
        retrieval_query = f"""
        MATCH (u:User {{user_id: '{user_id}'}})-[:UPLOADED]->(f:File)-[:HAS_CHUNK]->(c:Chunk)
        WHERE c.textEmbedding IS NOT NULL {file_filter}
        RETURN c.text AS text,
               score,
               {{
                   source: f.source,
                   filename: f.filename,
                   user_id: f.user_id,
                   chunk_index: c.chunk_index,
                   section: c.section,
                   id: c.id,
                   original_url: f.original_url
               }} AS metadata
        ORDER BY score DESC
        LIMIT 10
        """

        # Create vector store with user-scoped retrieval query
        vector_store = Neo4jVector.from_existing_index(
            embedding=OpenAIEmbeddings(),
            url=NEO4J_URI,
            username=NEO4J_USER,
            password=NEO4J_PASS,
            index_name=VECTOR_INDEX_NAME,
            text_node_property=VECTOR_SOURCE_PROPERTY,
            retrieval_query=retrieval_query)

        retriever = vector_store.as_retriever(search_kwargs={
            "k": 10,
            "score_threshold": 0.3
        })

        # Use Claude for better QA responses
        return ClaudeQASystem(retriever)
    except Exception as e:
        print(f"Error setting up QA system for user {user_id}: {e}")
        raise

class ClaudeQASystem:
    """
    Custom QA system using Claude for better, more detailed responses
    """
    def __init__(self, retriever):
        self.retriever = retriever
        self.client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
        
    def invoke(self, question_dict):
        try:
            question = question_dict.get("question", "")
            
            # Retrieve relevant documents
            docs = self.retriever.get_relevant_documents(question)
            
            if not docs:
                return {
                    "answer": "I don't have enough information to answer that question.",
                    "source_documents": []
                }
            
            # Prepare context from retrieved documents
            context_parts = []
            for doc in docs:
                context_parts.append(f"Document: {doc.page_content}")
                if hasattr(doc, 'metadata'):
                    context_parts.append(f"Source: {doc.metadata.get('filename', 'Unknown')}")
                    context_parts.append(f"Section: {doc.metadata.get('section', 'Unknown')}")
                context_parts.append("---")
            
            context = "\n".join(context_parts)
            
            # Create Claude prompt
            system_prompt = """You are a helpful AI assistant that answers questions based on the provided context. 
            Always provide detailed, accurate answers using the information from the context. 
            If the context doesn't contain enough information to answer the question completely, 
            say so and provide what information you can. 
            Be conversational but informative."""
            
            user_prompt = f"""Based on the following context, please answer this question very precisely and briefly: {question}

Context:
{context}

Please provide a short answer based on the context provided."""
            
            # Call Claude API
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",  # Use the latest Claude model
                max_tokens=2000,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            answer = message.content[0].text
            
            return {
                "answer": answer,
                "source_documents": docs
            }
            
        except Exception as e:
            print(f"Error in Claude QA system: {e}")
            return {
                "answer": f"I encountered an error while processing your question very precise: {str(e)}",
                "source_documents": []
            }

def process_and_store_pdf(pdf_path, user_id):
    """Complete workflow to process a PDF file and store it in Neo4j with proper graph relationships"""
    filename = os.path.basename(pdf_path)

    logger.info(f"Starting PDF processing for user {user_id}, file: {filename}")

    # Clear existing data for this user's file
    remove_existing_file_nodes(filename, user_id)

    # Extract and clean text
    try:
        pdf_text, extraction_stats = extract_text_from_pdf(
            pdf_path,
            languages=['eng']  # Add more languages if needed, e.g., ['eng', 'fra', 'deu']
        )

        # Store extraction statistics in the File node
        extraction_metadata = {
            'pages_processed': extraction_stats['total_pages'],
            'images_processed': extraction_stats['total_images'],
            'successful_ocr': extraction_stats['successful_ocr'],
            'failed_ocr': extraction_stats['failed_ocr'],
            'extraction_errors': len(extraction_stats['errors'])
        }

        logger.info("PDF text extracted and cleaned successfully")

        # Split into chunks
        chunks = split_text(pdf_text)
        logger.info(f"Created {len(chunks)} text chunks")

        # Create graph structure with relationships
        create_graph_and_store_chunks(chunks, filename, user_id, extraction_metadata)

        # Create sequential chunk relationships
        create_chunk_relationships(filename)

        # Create embeddings
        create_vector_index_and_embeddings(filename)

        logger.info(f"Successfully processed {user_id}/{filename}")
        return filename

    except Exception as e:
        logger.error(f"Error processing PDF {filename}: {str(e)}")
        raise

def ask_question_with_diversity(user_id: str, question: str, filenames: list = None):
    """
    Ask a question with diverse source retrieval to avoid bias
    """
    try:
        from langchain_openai import OpenAIEmbeddings
        
        # Get embedding for the question
        embeddings = OpenAIEmbeddings()
        question_embedding = embeddings.embed_query(question)
        
        # Build filename filter for the query
        if filenames:
            filenames_str = ', '.join([f'"{f}"' for f in filenames])
            file_filter = f"AND f.filename IN [{filenames_str}]"
        else:
            file_filter = ""

        # Use a simpler approach to ensure diversity by selecting from each file
        chunks = safe_kg_query(f"""
            MATCH (u:User {{user_id: '{user_id}'}})-[:UPLOADED]->(f:File)-[:HAS_CHUNK]->(c:Chunk)
            WHERE c.textEmbedding IS NOT NULL {file_filter}
            WITH f, COLLECT(c) AS all_chunks
            UNWIND all_chunks[0..5] AS c  // Get up to 5 chunks per file for diversity
            RETURN c.text AS text,
                   0.5 AS score,
                   c.id AS chunk_id, 
                   c.filename AS filename,
                   c.section AS section,
                   c.chunk_index AS chunk_index,
                   c.user_id AS user_id
            ORDER BY c.filename, c.chunk_index
            LIMIT 10
        """)
        
        if not chunks:
            return {
                "status": "success",
                "answer": "I don't have enough information to answer that question.",
                "question": question,
                "sources": [],
                "total_sources": 0
            }
        
        # Create context for Claude
        context_parts = []
        sources = []
        
        for chunk in chunks:
            context_parts.append(f"Document: {chunk['text']}")
            context_parts.append(f"Source: {chunk['filename']}")
            context_parts.append("---")
            
            # Get original URL for this file
            file_info = safe_kg_query("""
                MATCH (f:File {filename: $filename, user_id: $user_id})
                RETURN f.original_url AS original_url
            """, params={'filename': chunk['filename'], 'user_id': user_id})
            
            original_url = file_info[0]['original_url'] if file_info else None
            
            sources.append({
                'filename': chunk['filename'],
                'user_id': chunk['user_id'],
                'section': chunk['section'],
                'chunk_index': chunk['chunk_index'],
                'chunk_id': chunk.get('chunk_id', chunk.get('id', 'Unknown')),
                'original_url': original_url
            })
        
        context = "\n".join(context_parts)
        
        # Use Claude for the answer
        system_prompt = """You are a helpful AI assistant that answers questions based on the provided context. 
        Always provide detailed, accurate answers using the information from the context. 
        If the context doesn't contain enough information to answer the question completely, 
        say so and provide what information you can. 
        Be conversational but informative."""
        
        user_prompt = f"""Based on the following context, please answer this question very precisely and briefly: {question}

Context:
{context}

Please provide a short answer based on the context provided."""
        
        # Call Claude API
        import anthropic
        client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        answer = message.content[0].text
        
        return {
            "status": "success",
            "answer": answer,
            "question": question,
            "sources": sources,
            "total_sources": len(sources)
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing question: {str(e)}",
            "error": str(e)
        }

def ask_question(user_id: str, question: str, filenames: list = None):
    """
    Ask a question against user's knowledge graph
    Args:
        user_id: User identifier 
        question: Question to ask
        filenames: List of specific filenames to search in (optional)
    Returns:
        dict: QA response with answer and source information
    """
    try:
        # Try diverse search first
        return ask_question_with_diversity(user_id, question, filenames)
        
    except Exception as e:
        # Fallback to original method
        try:
            # Setup QA system for the user
            qa_chain = setup_qa_system(user_id, filenames)
            
            # Get response from QA chain
            response = qa_chain.invoke({"question": question})
            
            # Extract source information
            sources = []
            for doc in response.get('source_documents', []):
                source_info = {
                    'filename': doc.metadata.get('filename', 'Unknown'),
                    'user_id': doc.metadata.get('user_id', 'Unknown'), 
                    'section': doc.metadata.get('section', 'Unknown'),
                    'chunk_index': doc.metadata.get('chunk_index', 'Unknown'),
                    'chunk_id': doc.metadata.get('id', 'Unknown'),
                    'original_url': doc.metadata.get('original_url')  # Include original URL
                }
                sources.append(source_info)
            
            return {
                "status": "success",
                "answer": response.get('answer', ''),
                "question": question,
                "sources": sources,
                "total_sources": len(sources)
            }
            
        except Exception as e2:
            return {
                "status": "error",
                "message": f"Error processing question: {str(e2)}",
                "error": str(e2)
            }

def get_graph_traversal_path(sources, user_id):
    """
    Generate graph traversal path showing nodes and edges that supported the answer
    """
    try:
        # Check if Neo4j is available
        kg_conn = get_neo4j_connection()
        if kg_conn is None:
            return {"error": "Neo4j connection not available"}
            
        traversal_data = {
            "nodes": [],
            "edges": [],
            "metadata": {
                "total_nodes": 0,
                "total_edges": 0,
                "files_involved": set()
            }
        }
        
        for source in sources:
            filename = source.get('filename', 'Unknown')
            chunk_id = source.get('chunk_id', 'Unknown')
            section = source.get('section', 'Unknown')
            
            # Get the chunk node
            chunk_result = safe_kg_query("""
                MATCH (c:Chunk {id: $chunk_id, user_id: $user_id})
                RETURN c.id as id, c.text as text, c.chunk_index as index, c.section as section
            """, params={'chunk_id': chunk_id, 'user_id': user_id})
            
            if chunk_result:
                chunk_data = chunk_result[0]
                # Create a meaningful label from the text content
                text_content = chunk_data["text"].strip()
                if text_content:
                    # Get last 50 characters and clean them up
                    label_text = text_content[-50:].strip()
                    # Remove any incomplete words at the beginning
                    if len(label_text) == 50 and ' ' in label_text:
                        label_text = label_text[label_text.find(' ') + 1:]
                    # Truncate if still too long
                    if len(label_text) > 40:
                        label_text = label_text[-40:] + "..."
                else:
                    label_text = f"Chunk {chunk_data['index']}"
                
                traversal_data["nodes"].append({
                    "id": chunk_data["id"],
                    "label": label_text,
                    "type": "chunk",
                    "text": chunk_data["text"][:100] + "..." if len(chunk_data["text"]) > 100 else chunk_data["text"],
                    "section": chunk_data["section"],
                    "filename": filename
                })
                traversal_data["metadata"]["files_involved"].add(filename)
            
            # Get related chunks (NEXT relationships)
            related_result = safe_kg_query("""
                MATCH (c:Chunk {id: $chunk_id, user_id: $user_id})-[:NEXT]->(next:Chunk)
                RETURN next.id as id, next.text as text, next.chunk_index as index
                LIMIT 2
            """, params={'chunk_id': chunk_id, 'user_id': user_id})
            
            for related in related_result:
                # Create a meaningful label from the related chunk text
                related_text_content = related["text"].strip()
                if related_text_content:
                    # Get last 50 characters and clean them up
                    related_label_text = related_text_content[-50:].strip()
                    # Remove any incomplete words at the beginning
                    if len(related_label_text) == 50 and ' ' in related_label_text:
                        related_label_text = related_label_text[related_label_text.find(' ') + 1:]
                    # Truncate if still too long
                    if len(related_label_text) > 40:
                        related_label_text = related_label_text[-40:] + "..."
                else:
                    related_label_text = f"Chunk {related['index']}"
                
                traversal_data["nodes"].append({
                    "id": related["id"],
                    "label": related_label_text,
                    "type": "related_chunk",
                    "text": related["text"][:100] + "..." if len(related["text"]) > 100 else related["text"],
                    "section": section,
                    "filename": filename
                })
                
                traversal_data["edges"].append({
                    "source": chunk_id,
                    "target": related["id"],
                    "type": "NEXT",
                    "label": "follows"
                })
        
        # Get file nodes
        for filename in traversal_data["metadata"]["files_involved"]:
            file_result = safe_kg_query("""
                MATCH (f:File {filename: $filename, user_id: $user_id})
                RETURN f.filename as filename, f.total_chunks as total_chunks
            """, params={'filename': filename, 'user_id': user_id})
            
            if file_result:
                file_data = file_result[0]
                traversal_data["nodes"].append({
                    "id": f"file_{filename}",
                    "label": filename,
                    "type": "file",
                    "total_chunks": file_data["total_chunks"],
                    "filename": filename
                })
                
                # Connect chunks to file
                for node in traversal_data["nodes"]:
                    if node.get("filename") == filename and node.get("type") == "chunk":
                        traversal_data["edges"].append({
                            "source": f"file_{filename}",
                            "target": node["id"],
                            "type": "HAS_CHUNK",
                            "label": "contains"
                        })
        
        traversal_data["metadata"]["total_nodes"] = len(traversal_data["nodes"])
        traversal_data["metadata"]["total_edges"] = len(traversal_data["edges"])
        traversal_data["metadata"]["files_involved"] = list(traversal_data["metadata"]["files_involved"])
        
        return traversal_data
        
    except Exception as e:
        print(f"Error generating traversal path: {e}")
        return {"error": str(e)}

def create_url_knowledge_graph(user_id, filename, file_contents, original_url, content_type=None):
    """Create knowledge graph for URL content with original URL stored as metadata"""
    try:
        create_or_get_user(user_id)
        
        # For URLs, we know it's text content
        text = file_contents.decode('utf-8')
        metadata = {
            'pages_processed': 1,
            'images_processed': 0,
            'successful_ocr': 1,
            'failed_ocr': 0,
            'extraction_errors': 0,
            'original_url': original_url  # Store the original URL
        }
        
        chunks_count = _process_text_file(text, filename, user_id, metadata)
        return {"status": "success", "processed_filename": filename, "chunks": chunks_count, "file_type": "text"}
        
    except Exception as e:
        return {"status": "error", "message": f"Error processing URL '{original_url}': {str(e)}", "error": str(e)}

def create_file_knowledge_graph(user_id, filename, file_contents, content_type=None):
    try:
        create_or_get_user(user_id)

        text, file_type = None, None


        # PDF
        if filename.lower().endswith('.pdf') or (content_type and 'pdf' in content_type.lower()):
            temp_pdf_path = f"/tmp/{filename}"
            with open(temp_pdf_path, 'wb') as f:
                f.write(file_contents)
            try:
                pdf_text, stats = extract_text_from_pdf(temp_pdf_path, languages=['eng'])
                metadata = {
                    'pages_processed': stats['total_pages'],
                    'images_processed': stats['total_images'],
                    'successful_ocr': stats['successful_ocr'],
                    'failed_ocr': stats['failed_ocr'],
                    'extraction_errors': len(stats['errors']),
                    'original_url': None  # No URL for file uploads
                }
                chunks_count = _process_text_file(pdf_text, filename, user_id, metadata)
                os.remove(temp_pdf_path)
                return {"status": "success", "processed_filename": filename, "chunks": chunks_count, "file_type": "pdf"}
            except Exception as e:
                if os.path.exists(temp_pdf_path):
                    os.remove(temp_pdf_path)
                raise e

        # Image
        elif filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')) or (content_type and 'image' in content_type.lower()):
            text = extract_text_from_image(file_contents)
            metadata = {
                'pages_processed': 1,
                'images_processed': 1,
                'successful_ocr': 1 if text else 0,
                'failed_ocr': 0 if text else 1,
                'extraction_errors': 0,
                'original_url': None  # No URL for file uploads
            }
            chunks_count = _process_text_file(text, filename, user_id, metadata)
            return {"status": "success", "processed_filename": filename, "chunks": chunks_count, "file_type": "image"}
        # Text or other files → decode as UTF-8
        else:
            try:
                text = file_contents.decode('utf-8')
                metadata = {
                    'pages_processed': 1,
                    'images_processed': 0,
                    'successful_ocr': 1,
                    'failed_ocr': 0,
                    'extraction_errors': 0,
                    'original_url': None  # No URL for file uploads
                }
                file_type = "text"
            except Exception:
                # Cannot decode → register unprocessed
                text = None
                file_type = "other"
                metadata = None

        # If text was successfully extracted, process normally
        if text:
            chunks_count = _process_text_file(text, filename, user_id, metadata)
            return {"status": "success", "processed_filename": filename, "chunks": chunks_count, "file_type": file_type}
        else:
            # File could not be converted to text, just register
            return {"status": "success", "message": f"File '{filename}' registered (unprocessed)", "file_type": file_type}

    except Exception as e:
        return {"status": "error", "message": f"Error processing file '{filename}': {str(e)}", "error": str(e)}