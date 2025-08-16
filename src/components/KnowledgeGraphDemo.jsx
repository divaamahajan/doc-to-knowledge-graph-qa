import React, { useState } from 'react';
import KnowledgeGraphVisualizer from './KnowledgeGraphVisualizer';

const KnowledgeGraphDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState('simple');

  const demoData = {
    simple: {
      nodes: [
        {
          id: 'file_demo.txt',
          label: 'demo.txt',
          type: 'file',
          total_chunks: 3,
          filename: 'demo.txt'
        },
        {
          id: 'chunk_1',
          label: 'Chunk 1',
          type: 'chunk',
          text: 'This is the first chunk of text from the demo file.',
          section: 'section_1',
          filename: 'demo.txt'
        },
        {
          id: 'chunk_2',
          label: 'Chunk 2',
          type: 'chunk',
          text: 'This is the second chunk with more content.',
          section: 'section_1',
          filename: 'demo.txt'
        }
      ],
      edges: [
        {
          source: 'file_demo.txt',
          target: 'chunk_1',
          type: 'HAS_CHUNK',
          label: 'contains'
        },
        {
          source: 'file_demo.txt',
          target: 'chunk_2',
          type: 'HAS_CHUNK',
          label: 'contains'
        },
        {
          source: 'chunk_1',
          target: 'chunk_2',
          type: 'NEXT',
          label: 'follows'
        }
      ],
      metadata: {
        total_nodes: 3,
        total_edges: 3,
        files_involved: ['demo.txt']
      }
    },
    complex: {
      nodes: [
        {
          id: 'file_research.pdf',
          label: 'research.pdf',
          type: 'file',
          total_chunks: 5,
          filename: 'research.pdf'
        },
        {
          id: 'file_notes.txt',
          label: 'notes.txt',
          type: 'file',
          total_chunks: 3,
          filename: 'notes.txt'
        },
        {
          id: 'chunk_research_1',
          label: 'Research Chunk 1',
          type: 'chunk',
          text: 'Introduction to the research topic with key findings.',
          section: 'research_section_1',
          filename: 'research.pdf'
        },
        {
          id: 'chunk_research_2',
          label: 'Research Chunk 2',
          type: 'chunk',
          text: 'Methodology and experimental setup details.',
          section: 'research_section_1',
          filename: 'research.pdf'
        },
        {
          id: 'chunk_notes_1',
          label: 'Notes Chunk 1',
          type: 'chunk',
          text: 'Personal notes and observations from the research.',
          section: 'notes_section_1',
          filename: 'notes.txt'
        }
      ],
      edges: [
        {
          source: 'file_research.pdf',
          target: 'chunk_research_1',
          type: 'HAS_CHUNK',
          label: 'contains'
        },
        {
          source: 'file_research.pdf',
          target: 'chunk_research_2',
          type: 'HAS_CHUNK',
          label: 'contains'
        },
        {
          source: 'file_notes.txt',
          target: 'chunk_notes_1',
          type: 'HAS_CHUNK',
          label: 'contains'
        },
        {
          source: 'chunk_research_1',
          target: 'chunk_research_2',
          type: 'NEXT',
          label: 'follows'
        }
      ],
      metadata: {
        total_nodes: 5,
        total_edges: 4,
        files_involved: ['research.pdf', 'notes.txt']
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Graph Visualizer Demo</h1>
          <p className="text-gray-600">Interactive demonstration of the knowledge graph visualization component</p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Demo Data</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedDemo('simple')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDemo === 'simple'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Simple Graph (3 nodes, 3 edges)
              </button>
              <button
                onClick={() => setSelectedDemo('complex')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDemo === 'complex'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Complex Graph (5 nodes, 4 edges)
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Demo: {selectedDemo === 'simple' ? 'Simple' : 'Complex'}</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Nodes:</strong> {demoData[selectedDemo].metadata.total_nodes}</p>
              <p><strong>Edges:</strong> {demoData[selectedDemo].metadata.total_edges}</p>
              <p><strong>Files:</strong> {demoData[selectedDemo].metadata.files_involved.length}</p>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Interactive Visualization</h2>
            <p className="text-gray-600">
              This is a live demonstration of the KnowledgeGraphVisualizer component. 
              The graph shows files (blue), chunks (green), and their relationships.
            </p>
          </div>
          
          <KnowledgeGraphVisualizer graphData={demoData[selectedDemo]} />
        </div>

        {/* Component Info */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Component Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🎨 Visual Elements</h4>
              <ul className="space-y-1">
                <li>• Interactive force-directed layout</li>
                <li>• Color-coded node types (Files, Chunks, Related)</li>
                <li>• Draggable nodes for exploration</li>
                <li>• Arrow markers for directed edges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 Technical Features</h4>
              <ul className="space-y-1">
                <li>• D3.js powered visualization</li>
                <li>• Responsive design</li>
                <li>• Tooltips with detailed information</li>
                <li>• Metadata display and statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphDemo;
