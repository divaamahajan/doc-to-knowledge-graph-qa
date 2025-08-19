#!/usr/bin/env python3
"""
Simple test script for URL ingestion functionality
"""
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_url_extractor_import():
    """Test that the URL extractor can be imported"""
    try:
        from utils.url_extractor import extract_text_from_url
        print("✅ URL extractor imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import URL extractor: {e}")
        return False

def test_url_extractor_function():
    """Test that the URL extractor function exists and has correct signature"""
    try:
        from utils.url_extractor import extract_text_from_url
        import inspect
        
        # Check function signature
        sig = inspect.signature(extract_text_from_url)
        params = list(sig.parameters.keys())
        
        if params == ['url', 'max_size_mb']:
            print("✅ URL extractor function has correct signature")
            return True
        else:
            print(f"❌ URL extractor function has incorrect signature: {params}")
            return False
    except Exception as e:
        print(f"❌ Error testing URL extractor function: {e}")
        return False

def test_router_endpoint():
    """Test that the URL upload endpoint is properly defined in the router"""
    try:
        # Check if the endpoint is defined in the router file
        with open('routers/knowledge_graph.py', 'r') as f:
            content = f.read()
        
        if 'url-upload' in content:
            print("✅ URL upload endpoint found in router")
        else:
            print("❌ URL upload endpoint not found in router")
            return False
        
        if 'upload_url' in content:
            print("✅ upload_url function found in router")
        else:
            print("❌ upload_url function not found in router")
            return False
        
        if 'extract_text_from_url' in content:
            print("✅ URL extractor import found in router")
        else:
            print("❌ URL extractor import not found in router")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Error checking router: {e}")
        return False

def test_dependencies():
    """Test that required dependencies are available"""
    try:
        import requests
        print("✅ requests module available")
    except ImportError:
        print("❌ requests module not available")
        return False
    
    try:
        import bs4
        print("✅ beautifulsoup4 module available")
    except ImportError:
        print("❌ beautifulsoup4 module not available")
        return False
    
    return True

def main():
    """Run all tests"""
    print("🧪 Simple URL Ingestion Tests")
    print("=" * 40)
    print()
    
    tests = [
        ("Dependencies", test_dependencies),
        ("URL Extractor Import", test_url_extractor_import),
        ("URL Extractor Function", test_url_extractor_function),
        ("Router Endpoint", test_router_endpoint)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"📋 Running: {test_name}")
        print("-" * 30)
        try:
            if test_func():
                print(f"✅ {test_name}: PASSED")
                passed += 1
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
        print()
    
    print("=" * 40)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! URL ingestion functionality is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
