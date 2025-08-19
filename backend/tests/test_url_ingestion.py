#!/usr/bin/env python3
"""
Test file for URL ingestion functionality
"""
import sys
import os
import unittest
from unittest.mock import patch, MagicMock

# Add the parent directory to the path to access utils and routers
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class TestURLExtractor(unittest.TestCase):
    """Test cases for URL text extraction"""
    
    def setUp(self):
        """Set up test fixtures"""
        pass
    
    @patch('requests.get')
    def test_extract_text_from_url_success(self, mock_get):
        """Test successful URL text extraction"""
        # Mock the HTTP response
        mock_response = MagicMock()
        mock_response.content = b'<html><head><title>Test Page</title></head><body><p>This is test content</p></body></html>'
        mock_response.headers = {'content-type': 'text/html'}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        from utils.url_extractor import extract_text_from_url
        
        # Test URL extraction
        text, metadata = extract_text_from_url('https://example.com/test')
        
        # Verify text extraction
        self.assertIn('This is test content', text)
        self.assertEqual(metadata['url'], 'https://example.com/test')
        self.assertEqual(metadata['title'], 'Test Page')
        self.assertEqual(metadata['domain'], 'example.com')
        self.assertEqual(metadata['content_type'], 'text/html')
        self.assertEqual(metadata['extraction_method'], 'web_scraping')
    
    def test_extract_text_from_url_invalid_format(self):
        """Test URL extraction with invalid URL format"""
        from utils.url_extractor import extract_text_from_url
        
        with self.assertRaises(ValueError) as context:
            extract_text_from_url('not-a-url')
        
        self.assertIn('Invalid URL format', str(context.exception))
    
    @patch('requests.get')
    def test_extract_text_from_url_size_limit(self, mock_get):
        """Test URL extraction with content size exceeding limit"""
        # Mock large response
        mock_response = MagicMock()
        mock_response.content = b'x' * (101 * 1024 * 1024)  # 101MB
        mock_response.headers = {'content-type': 'text/html'}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        from utils.url_extractor import extract_text_from_url
        
        with self.assertRaises(ValueError) as context:
            extract_text_from_url('https://example.com/large')
        
        self.assertIn('exceeds limit', str(context.exception))
    
    @patch('requests.get')
    def test_extract_text_from_url_http_error(self, mock_get):
        """Test URL extraction with HTTP error"""
        mock_get.side_effect = Exception('Connection failed')
        
        from utils.url_extractor import extract_text_from_url
        
        with self.assertRaises(ValueError) as context:
            extract_text_from_url('https://example.com/error')
        
        self.assertIn('Failed to extract text from URL', str(context.exception))

class TestURLUploadEndpoint(unittest.TestCase):
    """Test cases for URL upload endpoint"""
    
    def setUp(self):
        """Set up test fixtures"""
        pass
    
    @patch('utils.url_extractor.extract_text_from_url')
    @patch('utils.knowledge_graph.create_file_knowledge_graph')
    def test_upload_url_success(self, mock_create_kg, mock_extract):
        """Test successful URL upload"""
        # Mock URL extraction
        mock_extract.return_value = (
            'This is extracted text content',
            {
                'url': 'https://example.com/test',
                'title': 'Test Page',
                'domain': 'example.com',
                'content_type': 'text/html',
                'content_size_mb': 0.1,
                'extraction_method': 'web_scraping'
            }
        )
        
        # Mock knowledge graph creation
        mock_create_kg.return_value = {'status': 'success', 'message': 'Knowledge graph created'}
        
        # Import the router to test the endpoint
        from routers.knowledge_graph import upload_url
        
        # Mock user dependency
        mock_user = {'user_id': 'test-user-123'}
        
        # Test the endpoint function
        result = upload_url(url='https://example.com/test', user=mock_user)
        
        # Verify the result
        self.assertEqual(result['message'], 'URL processed successfully')
        self.assertIn('url_example_com_test.txt', result['filename'])
        self.assertEqual(result['knowledge_graph']['status'], 'success')
        self.assertEqual(result['metadata']['domain'], 'example.com')
        
        # Verify the knowledge graph function was called correctly
        mock_create_kg.assert_called_once()
        call_args = mock_create_kg.call_args
        self.assertEqual(call_args[1]['user_id'], 'test-user-123')
        self.assertEqual(call_args[1]['content_type'], 'text/plain')
        self.assertEqual(call_args[1]['source_url'], 'https://example.com/test')
    
    @patch('utils.url_extractor.extract_text_from_url')
    def test_upload_url_extraction_error(self, mock_extract):
        """Test URL upload with extraction error"""
        # Mock extraction failure
        mock_extract.side_effect = ValueError('Failed to extract text')
        
        from routers.knowledge_graph import upload_url
        
        mock_user = {'user_id': 'test-user-123'}
        
        with self.assertRaises(Exception) as context:
            upload_url(url='https://example.com/error', user=mock_user)
        
        self.assertIn('Error processing URL', str(context.exception))

def run_tests():
    """Run all tests"""
    print("🧪 Testing URL Ingestion Functionality...")
    print("=" * 50)
    print()
    
    # Create test suite using modern unittest approach
    loader = unittest.TestLoader()
    test_suite = unittest.TestSuite()
    
    # Add test cases
    test_suite.addTests(loader.loadTestsFromTestCase(TestURLExtractor))
    test_suite.addTests(loader.loadTestsFromTestCase(TestURLUploadEndpoint))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    print()
    print("=" * 50)
    print(f"📊 Test Results: {result.testsRun - len(result.failures) - len(result.errors)}/{result.testsRun} tests passed")
    
    if result.failures:
        print(f"❌ Failures: {len(result.failures)}")
        for test, traceback in result.failures:
            print(f"  - {test}: {traceback}")
    
    if result.errors:
        print(f"⚠️  Errors: {len(result.errors)}")
        for test, traceback in result.errors:
            print(f"  - {test}: {traceback}")
    
    if result.wasSuccessful():
        print("🎉 All tests passed! URL ingestion functionality is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
