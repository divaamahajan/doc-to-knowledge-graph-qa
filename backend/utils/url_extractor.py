import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
import logging

logger = logging.getLogger(__name__)

def extract_text_from_url(url, max_size_mb=100):
    """
    Extract text content from a URL
    Args:
        url: URL to extract text from
        max_size_mb: Maximum size in MB (default 100MB)
    Returns:
        tuple: (extracted_text, metadata)
    """
    try:
        # Validate URL
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise ValueError("Invalid URL format")
        
        # Fetch content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Check content size
        content_size_mb = len(response.content) / (1024 * 1024)
        if content_size_mb > max_size_mb:
            raise ValueError(f"Content size ({content_size_mb:.1f}MB) exceeds limit ({max_size_mb}MB)")
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Extract text
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Extract metadata
        metadata = {
            'url': url,
            'title': soup.title.string if soup.title else 'No title',
            'domain': parsed_url.netloc,
            'content_type': response.headers.get('content-type', 'text/html'),
            'content_size_mb': content_size_mb,
            'extraction_method': 'web_scraping'
        }
        
        return text, metadata
        
    except Exception as e:
        logger.error(f"Error extracting text from URL {url}: {str(e)}")
        raise ValueError(f"Failed to extract text from URL: {str(e)}")
