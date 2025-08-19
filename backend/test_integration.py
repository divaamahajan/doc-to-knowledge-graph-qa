#!/usr/bin/env python3
"""
Simple integration test to verify the enhanced knowledge graph endpoints are properly registered
"""

import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_router_registration():
    """Test that the enhanced endpoints are properly registered in the router"""
    try:
        from routers.knowledge_graph import router
        
        # Check if the qa endpoint exists
        qa_endpoint = None
        graph_traversal_endpoint = None
        
        for route in router.routes:
            if hasattr(route, 'endpoint'):
                if route.endpoint.__name__ == 'qa_endpoint':
                    qa_endpoint = route
                elif route.endpoint.__name__ == 'get_graph_traversal':
                    graph_traversal_endpoint = route
        
        print("🔍 Checking router registration...")
        
        # Verify qa endpoint
        if qa_endpoint:
            print(f"✅ QA endpoint found: {qa_endpoint.path} [{qa_endpoint.methods}]")
        else:
            print("❌ QA endpoint not found")
            return False
        
        # Verify graph traversal endpoint
        if graph_traversal_endpoint:
            print(f"✅ Graph traversal endpoint found: {graph_traversal_endpoint.path} [{graph_traversal_endpoint.methods}]")
        else:
            print("❌ Graph traversal endpoint not found")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing router registration: {e}")
        return False

def test_function_imports():
    """Test that the enhanced functions can be imported"""
    try:
        print("🔍 Testing function imports...")
        
        # Test importing the enhanced function
        from utils.knowledge_graph import get_graph_traversal_path
        print("✅ get_graph_traversal_path function imported successfully")
        
        # Test importing the enhanced endpoint
        from routers.knowledge_graph import qa_endpoint, get_graph_traversal
        print("✅ Enhanced endpoints imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing enhanced functions: {e}")
        return False

def test_function_signatures():
    """Test that the enhanced functions have the correct signatures"""
    try:
        print("🔍 Testing function signatures...")
        
        from utils.knowledge_graph import get_graph_traversal_path
        from routers.knowledge_graph import qa_endpoint, get_graph_traversal
        
        # Check function signatures
        import inspect
        
        # Check get_graph_traversal_path signature
        sig = inspect.signature(get_graph_traversal_path)
        params = list(sig.parameters.keys())
        if params == ['sources', 'user_id']:
            print("✅ get_graph_traversal_path has correct signature")
        else:
            print(f"❌ get_graph_traversal_path has incorrect signature: {params}")
            return False
        
        # Check qa_endpoint signature
        sig = inspect.signature(qa_endpoint)
        params = list(sig.parameters.keys())
        if params == ['question', 'filenames', 'user']:
            print("✅ qa_endpoint has correct signature")
        else:
            print(f"❌ qa_endpoint has incorrect signature: {params}")
            return False
        
        # Check get_graph_traversal signature
        sig = inspect.signature(get_graph_traversal)
        params = list(sig.parameters.keys())
        if params == ['question_id', 'user']:
            print("✅ get_graph_traversal has correct signature")
        else:
            print(f"❌ get_graph_traversal has incorrect signature: {params}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing function signatures: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Enhanced Knowledge Graph Integration Tests")
    print("=" * 50)
    print()
    
    tests = [
        ("Router Registration", test_router_registration),
        ("Function Imports", test_function_imports),
        ("Function Signatures", test_function_signatures)
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
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Enhanced knowledge graph functionality is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
