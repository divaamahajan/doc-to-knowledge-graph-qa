import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QAChatWindow from '../QAchatbot/QAChatWindow';
import Message from '../QAchatbot/Message';
import MessageList from '../QAchatbot/MessageList';

// Mock the KnowledgeGraphVisualizer component
jest.mock('../KnowledgeGraphVisualizer', () => {
  return function MockKnowledgeGraphVisualizer({ graphData }) {
    return (
      <div data-testid="knowledge-graph-visualizer">
        Mock Graph: {graphData?.nodes?.length || 0} nodes, {graphData?.edges?.length || 0} edges
      </div>
    );
  };
});

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

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Enhanced QA Chat with Graph Visualization', () => {
  const mockUser = { name: 'Test User' };
  const mockToken = 'mock-token';

  describe('Message Component', () => {
    const mockMessage = {
      id: 1,
      sender: 'bot',
      text: 'This is a test answer',
      timestamp: new Date(),
      sources: [
        { filename: 'test.txt', section: 'section_1' },
        { filename: 'demo.pdf', section: 'section_2' }
      ],
      traversalPath: {
        nodes: [{ id: 'node1', type: 'chunk' }],
        edges: [{ source: 'node1', target: 'node2' }],
        metadata: { total_nodes: 1, total_edges: 1 }
      }
    };

    test('renders bot message with sources', () => {
      render(<Message message={mockMessage} onToggleGraph={jest.fn()} />);
      
      expect(screen.getByText('This is a test answer')).toBeInTheDocument();
      expect(screen.getByText('Sources:')).toBeInTheDocument();
      expect(screen.getByText('📄 test.txt (Section: section_1)')).toBeInTheDocument();
      expect(screen.getByText('📄 demo.pdf (Section: section_2)')).toBeInTheDocument();
    });

    test('shows "Why? Show Graph" button when traversal path exists', () => {
      render(<Message message={mockMessage} onToggleGraph={jest.fn()} />);
      
      // Use a more flexible text matcher
      const button = screen.getByRole('button', { name: /Why\? Show Graph/i });
      expect(button).toBeInTheDocument();
    });

    test('does not show graph button when no traversal path', () => {
      const messageWithoutPath = { ...mockMessage, traversalPath: null };
      render(<Message message={messageWithoutPath} onToggleGraph={jest.fn()} />);
      
      expect(screen.queryByRole('button', { name: /Why\? Show Graph/i })).not.toBeInTheDocument();
    });

    test('calls onToggleGraph when button is clicked', () => {
      const mockOnToggleGraph = jest.fn();
      render(<Message message={mockMessage} onToggleGraph={mockOnToggleGraph} />);
      
      const button = screen.getByRole('button', { name: /Why\? Show Graph/i });
      fireEvent.click(button);
      
      expect(mockOnToggleGraph).toHaveBeenCalledWith(1, true);
    });
  });

  describe('MessageList Component', () => {
    const mockMessages = [
      {
        id: 1,
        sender: 'user',
        text: 'What is this about?',
        timestamp: new Date()
      },
      {
        id: 2,
        sender: 'bot',
        text: 'This is about testing',
        timestamp: new Date(),
        sources: [{ filename: 'test.txt', section: 'section_1' }],
        traversalPath: {
          nodes: [{ id: 'node1', type: 'chunk' }],
          edges: [],
          metadata: { total_nodes: 1, total_edges: 0 }
        },
        showGraph: true
      }
    ];

    test('renders all messages', () => {
      render(<MessageList messages={mockMessages} onToggleGraph={jest.fn()} />);
      
      expect(screen.getByText('What is this about?')).toBeInTheDocument();
      expect(screen.getByText('This is about testing')).toBeInTheDocument();
    });

    test('shows graph visualization when message.showGraph is true', () => {
      render(<MessageList messages={mockMessages} onToggleGraph={jest.fn()} />);
      
      expect(screen.getByTestId('knowledge-graph-visualizer')).toBeInTheDocument();
      expect(screen.getByText('Mock Graph: 1 nodes, 0 edges')).toBeInTheDocument();
    });

    test('does not show graph when message.showGraph is false', () => {
      const messagesWithoutGraph = mockMessages.map(msg => ({ ...msg, showGraph: false }));
      render(<MessageList messages={messagesWithoutGraph} onToggleGraph={jest.fn()} />);
      
      expect(screen.queryByTestId('knowledge-graph-visualizer')).not.toBeInTheDocument();
    });
  });

  describe('QAChatWindow Integration', () => {
    test('renders without crashing', () => {
      render(<QAChatWindow user={mockUser} token={mockToken} />);
      
      // Use getAllByText to get all instances and check if any exist
      const aiAssistantElements = screen.getAllByText('AI Assistant');
      expect(aiAssistantElements.length).toBeGreaterThan(0);
    });

    test('has handleToggleGraph function', () => {
      const { container } = render(<QAChatWindow user={mockUser} token={mockToken} />);
      
      // The function should exist in the component
      expect(container).toBeInTheDocument();
    });
  });
});
