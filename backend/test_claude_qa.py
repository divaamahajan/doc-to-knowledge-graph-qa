#!/usr/bin/env python3
"""
Test script for Claude QA system
"""
import sys
import os
sys.path.append('.')

from utils.knowledge_graph import setup_qa_system

def test_claude_qa():
    """Test the Claude QA system"""
    try:
        print("Setting up Claude QA system...")
        qa_system = setup_qa_system("local-test-user")
        
        print("Testing question...")
        question = "Who is Priyanka Chopra?"
        
        response = qa_system.invoke({"question": question})
        
        print(f"Question: {question}")
        print(f"Answer: {response.get('answer', 'No answer')}")
        print(f"Sources: {len(response.get('source_documents', []))}")
        
        print("✅ Claude QA system test successful!")
        
    except Exception as e:
        print(f"❌ Error testing Claude QA system: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_claude_qa()
