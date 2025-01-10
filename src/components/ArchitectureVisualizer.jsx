import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import dagre from 'dagre';
import DraggableService from './DraggableService';

// Define node component outside
const AWSServiceNode = ({ data }) => (
  <motion.div
    className={`aws-service-node ${data.missing ? 'missing' : ''}`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Handle type="target" position="top" className="handle" />
    <div className="node-content">
      <img src={data.icon} alt={data.label} className="service-icon" />
      <span className="service-label">{data.label}</span>
      {data.missing && (
        <motion.div 
          className="missing-indicator"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
    <Handle type="source" position="bottom" className="handle" />
    <div className="node-tooltip">
      {data.description || `AWS ${data.label}`}
    </div>
  </motion.div>
);

// Memoize nodeTypes outside component
const nodeTypes = {
  awsService: AWSServiceNode
};

const ArchitectureVisualizer = ({ architecture, missingServices = [], onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const convertArchitectureToNodes = useCallback(() => {
    if (!architecture?.services) return;

    // Use dagre layout algorithm for better positioning
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });

    // Add nodes to dagre
    architecture.services.forEach(service => {
      dagreGraph.setNode(service.id, { width: 180, height: 100 });
    });

    // Add edges to dagre
    (architecture.connections || []).forEach(conn => {
      dagreGraph.setEdge(conn.from, conn.to);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Convert to ReactFlow nodes
    const newNodes = architecture.services.map(service => {
      const node = dagreGraph.node(service.id);
      return {
        id: service.id,
        type: 'awsService',
        position: { x: node.x, y: node.y },
        data: {
          label: service.name,
          icon: service.icon,
          missing: missingServices.includes(service.id),
          description: service.description
        }
      };
    });

    // Create edges with better styling
    const newEdges = (architecture.connections || []).map((conn) => ({
      id: `${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4FD1C5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [architecture, missingServices, setNodes, setEdges]);

  useEffect(() => {
    convertArchitectureToNodes();
  }, [architecture, convertArchitectureToNodes]);

  return (
    <div style={{ height: '500px' }} className="architecture-visualizer">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#4FD1C5" gap={16} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => node.data.missing ? '#FF5656' : '#4FD1C5'}
          maskColor="rgba(13, 25, 35, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export default ArchitectureVisualizer; 