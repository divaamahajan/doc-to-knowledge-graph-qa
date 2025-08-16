import React from 'react';
import { render, screen } from '@testing-library/react';
import KnowledgeGraphVisualizer from '../KnowledgeGraphVisualizer';

// Mock D3.js completely to avoid DOM manipulation issues in tests
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    selectAll: jest.fn(() => ({
      remove: jest.fn()
    })),
    append: jest.fn(() => ({
      append: jest.fn(() => ({
        attr: jest.fn(() => ({
          append: jest.fn(() => ({
            attr: jest.fn()
          }))
        }))
      }))
    }))
  })),
  forceSimulation: jest.fn(() => ({
    force: jest.fn(() => ({
      force: jest.fn(() => ({
        force: jest.fn(() => ({
          force: jest.fn()
        }))
      }))
    })),
    on: jest.fn(),
    stop: jest.fn()
  })),
  forceLink: jest.fn(() => ({
    id: jest.fn(() => ({
      distance: jest.fn()
    }))
  })),
  forceManyBody: jest.fn(() => ({
    strength: jest.fn()
  })),
  forceCenter: jest.fn(() => ({
    x: jest.fn(() => ({
      y: jest.fn()
    }))
  })),
  forceCollide: jest.fn(() => ({
    radius: jest.fn()
  })),
  drag: jest.fn(() => ({
    on: jest.fn(() => ({
      on: jest.fn(() => ({
        on: jest.fn()
      }))
    }))
  }))
}));

describe('KnowledgeGraphVisualizer', () => {
  const mockGraphData = {
    nodes: [
      {
        id: 'file_test.txt',
        label: 'test.txt',
        type: 'file',
        total_chunks: 5,
        filename: 'test.txt'
      },
      {
        id: 'chunk_1',
        label: 'Chunk 1',
        type: 'chunk',
        text: 'This is the first chunk of text',
        section: 'section_1',
        filename: 'test.txt'
      }
    ],
    edges: [
      {
        source: 'file_test.txt',
        target: 'chunk_1',
        type: 'HAS_CHUNK',
        label: 'contains'
      }
    ],
    metadata: {
      total_nodes: 2,
      total_edges: 1,
      files_involved: ['test.txt']
    }
  };

  test('renders without crashing', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    expect(screen.getByText('Knowledge Graph Visualization')).toBeInTheDocument();
  });

  test('displays graph metadata correctly', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    
    expect(screen.getByText('Nodes: 2')).toBeInTheDocument();
    expect(screen.getByText('Edges: 1')).toBeInTheDocument();
    expect(screen.getByText('Files: 1')).toBeInTheDocument();
  });

  test('shows legend with correct colors', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Chunks')).toBeInTheDocument();
    expect(screen.getByText('Related')).toBeInTheDocument();
  });

  test('renders SVG container', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100%');
    expect(svg).toHaveAttribute('height', '600');
  });

  test('shows no data message when graphData is null', () => {
    render(<KnowledgeGraphVisualizer graphData={null} />);
    
    expect(screen.getByText('No Graph Data')).toBeInTheDocument();
    expect(screen.getByText('Ask a question to see the knowledge graph visualization')).toBeInTheDocument();
  });

  test('shows no data message when graphData has no nodes', () => {
    render(<KnowledgeGraphVisualizer graphData={{ nodes: [], edges: [] }} />);
    
    expect(screen.getByText('No Graph Data')).toBeInTheDocument();
  });

  test('handles missing metadata gracefully', () => {
    const incompleteData = {
      nodes: mockGraphData.nodes,
      edges: mockGraphData.edges
    };
    
    render(<KnowledgeGraphVisualizer graphData={incompleteData} />);
    
    expect(screen.getByText('Nodes: 0')).toBeInTheDocument();
    expect(screen.getByText('Edges: 0')).toBeInTheDocument();
    expect(screen.getByText('Files: 0')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<KnowledgeGraphVisualizer graphData={mockGraphData} />);
    
    const container = screen.getByText('Knowledge Graph Visualization').closest('div');
    expect(container).toHaveClass('bg-blue-50', 'border', 'border-blue-200');
    
    const svgContainer = document.querySelector('svg').closest('div');
    expect(svgContainer).toHaveClass('bg-white', 'border', 'border-gray-200');
  });
});
