import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QAChatWindow from '../QAchatbot/QAChatWindow';

// Mock the ChatInput component
jest.mock('../QAchatbot/ChatInput', () => {
  return function MockChatInput({ onSend, disabled, isLoading }) {
    return (
      <div data-testid="chat-input">
        <button 
          onClick={() => onSend('Test question')}
          disabled={disabled}
          data-testid="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    );
  };
});

// Mock the MessageList component
jest.mock('../QAchatbot/MessageList', () => {
  return function MockMessageList({ messages, onToggleGraph }) {
    return (
      <div data-testid="message-list">
        {messages.map((msg, idx) => (
          <div key={idx} data-testid={`message-${idx}`}>
            {msg.text}
          </div>
        ))}
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('URL Integration in QAChatWindow', () => {
  const mockUser = { name: 'Test User' };
  const mockToken = 'mock-token';

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders URL input section', () => {
    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    expect(screen.getByText('🌐 Add URL Content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter URL to analyze...')).toBeInTheDocument();
    expect(screen.getByText('Add URL to Knowledge Graph')).toBeInTheDocument();
  });

  test('URL input state management', () => {
    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    const urlInput = screen.getByPlaceholderText('Enter URL to analyze...');
    const submitButton = screen.getByText('Add URL to Knowledge Graph');
    
    // Initially button should be disabled
    expect(submitButton).toBeDisabled();
    
    // Type a URL
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    
    // Button should now be enabled
    expect(submitButton).not.toBeDisabled();
  });

  test('shows initial message with URL instructions', () => {
    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    expect(screen.getByText(/🌐 Add URLs to analyze web content/)).toBeInTheDocument();
    expect(screen.getByText(/📁 Upload files and ask questions about them/)).toBeInTheDocument();
  });

  test('handles URL submission', async () => {
    const mockResponse = {
      filename: 'url_example_com_test.txt',
      message: 'URL processed successfully',
      knowledge_graph: { status: 'success' }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    const urlInput = screen.getByPlaceholderText('Enter URL to analyze...');
    const submitButton = screen.getByText('Add URL to Knowledge Graph');
    
    // Enter URL and submit
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test' } });
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText(/✅ URL processed successfully/)).toBeInTheDocument();
    });
    
    // Should show success message
    expect(screen.getByText(/I've successfully processed the URL/)).toBeInTheDocument();
  });

  test('handles URL submission error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    const urlInput = screen.getByPlaceholderText('Enter URL to analyze...');
    const submitButton = screen.getByText('Add URL to Knowledge Graph');
    
    // Enter URL and submit
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test' } });
    fireEvent.click(submitButton);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/❌ Failed to process URL/)).toBeInTheDocument();
    });
  });

  test('supports Enter key for URL submission', async () => {
    const mockResponse = {
      filename: 'url_example_com_test.txt',
      message: 'URL processed successfully'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<QAChatWindow user={mockUser} token={mockToken} />);
    
    const urlInput = screen.getByPlaceholderText('Enter URL to analyze...');
    
    // Enter URL and press Enter
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test' } });
    fireEvent.keyPress(urlInput, { key: 'Enter', code: 'Enter' });
    
    // Should process the URL
    await waitFor(() => {
      expect(screen.getByText(/✅ URL processed successfully/)).toBeInTheDocument();
    });
  });
});
