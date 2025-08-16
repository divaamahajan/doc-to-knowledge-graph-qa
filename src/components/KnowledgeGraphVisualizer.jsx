import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const KnowledgeGraphVisualizer = ({ graphData, width = 800, height = 600 }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!graphData || !graphData.nodes || !graphData.edges) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = 600;

    // Set up force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create arrow marker for directed edges
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create edges
    const edges = svg.append("g")
      .selectAll("line")
      .data(graphData.edges)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Create nodes
    const nodes = svg.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", d => {
        if (d.type === "file") return 25;
        if (d.type === "chunk") return 20;
        return 15;
      })
      .attr("fill", d => {
        if (d.type === "file") return "#3B82F6";
        if (d.type === "chunk") return "#10B981";
        return "#F59E0B";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels
    nodes.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("fill", "#fff")
      .attr("font-weight", "bold");

    // Add tooltips
    nodes.append("title")
      .text(d => {
        if (d.type === "chunk") {
          return `${d.label}
Section: ${d.section}
Text: ${d.text}`;
        }
        if (d.type === "file") {
          return `${d.label}
Total Chunks: ${d.total_chunks}`;
        }
        return d.label;
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      edges
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graphData]);

  if (!graphData || !graphData.nodes) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Graph Data</h3>
          <p className="mt-1 text-sm text-gray-500">Ask a question to see the knowledge graph visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Knowledge Graph Visualization</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <span className="font-medium">Nodes:</span> {graphData.metadata?.total_nodes || 0}
          </div>
          <div>
            <span className="font-medium">Edges:</span> {graphData.metadata?.total_edges || 0}
          </div>
          <div>
            <span className="font-medium">Files:</span> {graphData.metadata?.files_involved?.length || 0}
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-700">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Files
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mx-2 mr-1"></span> Chunks
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mx-2 mr-1"></span> Related
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          className="bg-gray-50"
        />
      </div>
    </div>
  );
};

export default KnowledgeGraphVisualizer;
