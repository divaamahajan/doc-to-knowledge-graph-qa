#!/usr/bin/env python3
"""
Direct test of the URL endpoint to identify the exact error
"""
import requests
import json

def test_url_endpoint():
    """Test the URL endpoint directly"""
    print("🧪 Testing URL endpoint directly...")
    
    # Test URL
    test_url = "https://httpbin.org/html"
    
    # Endpoint URL
    endpoint_url = "http://localhost:8000/knowledge-graph/url-upload"
    
    # Parameters
    params = {"url": test_url}
    
    print(f"   Testing endpoint: {endpoint_url}")
    print(f"   Test URL: {test_url}")
    print(f"   Parameters: {params}")
    
    try:
        # Make the request
        print("\n   🔍 Making POST request...")
        response = requests.post(endpoint_url, params=params)
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("   ✅ Success!")
            try:
                data = response.json()
                print(f"   Response Data: {json.dumps(data, indent=2)}")
            except:
                print(f"   Response Text: {response.text}")
        else:
            print("   ❌ Error Response:")
            print(f"   Response Text: {response.text}")
            
            # Try to parse error details
            try:
                error_data = response.json()
                print(f"   Error Details: {json.dumps(error_data, indent=2)}")
            except:
                print("   Could not parse error response as JSON")
                
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection Error: Could not connect to localhost:8000")
        print("   Make sure your backend server is running")
    except Exception as e:
        print(f"   ❌ Request Error: {e}")
        import traceback
        traceback.print_exc()

def test_simple_url():
    """Test with a very simple URL"""
    print("\n🧪 Testing with simple URL...")
    
    # Test URL
    test_url = "https://httpbin.org/get"
    
    # Endpoint URL
    endpoint_url = "http://localhost:8000/knowledge-graph/url-upload"
    
    # Parameters
    params = {"url": test_url}
    
    try:
        response = requests.post(endpoint_url, params=params)
        print(f"   Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error: {response.text}")
        else:
            print("   ✅ Simple URL test passed")
    except Exception as e:
        print(f"   ❌ Simple URL test failed: {e}")

def main():
    """Run the tests"""
    print("🔧 Direct Endpoint Testing")
    print("=" * 40)
    
    test_url_endpoint()
    test_simple_url()
    
    print("\n" + "=" * 40)
    print("💡 If you're still getting 500 errors, check:")
    print("   1. Backend server logs for detailed error messages")
    print("   2. That the server was restarted after code changes")
    print("   3. That all dependencies are properly installed")

if __name__ == "__main__":
    main()
