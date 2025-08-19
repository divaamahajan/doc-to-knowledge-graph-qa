import pytest
from unittest.mock import Mock, patch
import sys
import os

# Add the parent directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routers.knowledge_graph import qa_endpoint, get_graph_traversal
from utils.knowledge_graph import get_graph_traversal_path

class TestEnhancedKnowledgeGraph:
    
    def test_qa_endpoint_with_traversal_path(self):
        """Test that qa_endpoint returns traversal_path when sources are available"""
        # Mock user and question
        mock_user = {"user_id": "test_user"}
        mock_question = "What is this about?"
        
        # Mock successful ask_question result with sources
        mock_result = {
            "status": "success",
            "answer": "This is about testing",
            "sources": [
                {
                    "filename": "test.txt",
                    "chunk_id": "chunk_1",
                    "section": "section_1"
                }
            ]
        }
        
        with patch('routers.knowledge_graph.ask_question', return_value=mock_result), \
             patch('routers.knowledge_graph.get_graph_traversal_path') as mock_traversal:
            
            mock_traversal.return_value = {"nodes": [], "edges": []}
            
            # Call the endpoint
            result = qa_endpoint(
                question=mock_question,
                filenames=None,
                user=mock_user
            )
            
            # Verify traversal_path was added
            assert "traversal_path" in result
            assert result["traversal_path"] == {"nodes": [], "edges": []}
            
            # Verify the function was called with correct parameters
            mock_traversal.assert_called_once_with(mock_result["sources"], "test_user")
    
    def test_qa_endpoint_without_sources(self):
        """Test that qa_endpoint works normally when no sources are available"""
        mock_user = {"user_id": "test_user"}
        mock_question = "What is this about?"
        
        # Mock result without sources
        mock_result = {
            "status": "success",
            "answer": "This is about testing"
        }
        
        with patch('routers.knowledge_graph.ask_question', return_value=mock_result):
            result = qa_endpoint(
                question=mock_question,
                filenames=None,
                user=mock_user
            )
            
            # Verify no traversal_path was added
            assert "traversal_path" not in result
            assert result == mock_result
    
    def test_qa_endpoint_with_error_status(self):
        """Test that qa_endpoint works normally when status is not success"""
        mock_user = {"user_id": "test_user"}
        mock_question = "What is this about?"
        
        # Mock result with error status
        mock_result = {
            "status": "error",
            "message": "Something went wrong"
        }
        
        with patch('routers.knowledge_graph.ask_question', return_value=mock_result):
            result = qa_endpoint(
                question=mock_question,
                filenames=None,
                user=mock_user
            )
            
            # Verify no traversal_path was added
            assert "traversal_path" not in result
            assert result == mock_result
    
    def test_get_graph_traversal_endpoint(self):
        """Test the graph-traversal endpoint returns expected response"""
        mock_user = {"user_id": "test_user"}
        question_id = "test_question_123"
        
        result = get_graph_traversal(question_id, mock_user)
        
        assert result["status"] == "success"
        assert "traversal_path" in result
        assert result["traversal_path"] == "Graph traversal data"
    
    def test_get_graph_traversal_path_function(self):
        """Test the get_graph_traversal_path utility function"""
        # Mock sources data
        sources = [
            {
                "filename": "test.txt",
                "chunk_id": "test_user_test.txt_chunk_0",
                "section": "test_user_test.txt_section_0"
            }
        ]
        user_id = "test_user"
        
        # Mock Neo4j query results
        mock_chunk_result = [{
            "id": "test_user_test.txt_chunk_0",
            "text": "This is a test chunk with some content",
            "index": 0,
            "section": "test_user_test.txt_section_0"
        }]
        
        mock_file_result = [{
            "filename": "test.txt",
            "total_chunks": 1
        }]
        
        with patch('utils.knowledge_graph.kg') as mock_kg:
            mock_kg.query.side_effect = [
                mock_chunk_result,  # First call for chunk
                [],                 # Second call for related chunks
                mock_file_result    # Third call for file
            ]
            
            result = get_graph_traversal_path(sources, user_id)
            
            # Verify the structure
            assert "nodes" in result
            assert "edges" in result
            assert "metadata" in result
            
            # Verify metadata
            assert result["metadata"]["total_nodes"] > 0
            assert "test.txt" in result["metadata"]["files_involved"]
            
            # Verify nodes
            assert len(result["nodes"]) > 0
            chunk_node = next((n for n in result["nodes"] if n["type"] == "chunk"), None)
            assert chunk_node is not None
            assert chunk_node["filename"] == "test.txt"
            
            # Verify file node
            file_node = next((n for n in result["nodes"] if n["type"] == "file"), None)
            assert file_node is not None
            assert file_node["label"] == "test.txt"

if __name__ == "__main__":
    pytest.main([__file__])
