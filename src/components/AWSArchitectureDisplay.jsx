import React, { useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { getCachedServiceIcon } from '../services/IconResolver';

const AWSServiceNode = ({ data }) => (
  <motion.div
    className={`aws-service-node ${data.isMissing ? 'missing' : ''}`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Handle 
      type="target" 
      position="top" 
      id={`${data.id}-target`}
      className="handle"
    />
    <div className="node-content">
      <img src={data.icon} alt={data.label} className="service-icon" />
      <span className="service-label">{data.label}</span>
    </div>
    <Handle 
      type="source" 
      position="bottom" 
      id={`${data.id}-source`}
      className="handle"
    />
  </motion.div>
);

const nodeTypes = {
  awsService: AWSServiceNode
};

const createNodeId = (service) => {
  const serviceName = typeof service === 'string' ? service : service?.name;
  if (!serviceName) {
    console.warn('⚠️ Invalid service detected:', service);
    return 'invalid-service';
  }
  return serviceName.toLowerCase().replace(/\s+/g, '-');
};

const AWSArchitectureDisplay = ({ architecture }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const hasLoggedWarning = useRef(false);

  useEffect(() => {
    if (!architecture?.services && !hasLoggedWarning.current) {
      hasLoggedWarning.current = true;
      console.log('⚠️ Waiting for architecture data...');
      return;
    }

    if (architecture?.services) {
      console.log('📊 Rendering architecture:', {
        servicesCount: architecture.services.length,
        connectionsCount: architecture.connections?.length
      });

      const newNodes = [];
      const newEdges = [];
      const nodePositions = {}; 
      const parentChildrenMap = {};
      let missingServiceCounter = 1;
      const baseY = 200;
      const horizontalSpacing = 250; // Increased horizontal spacing
      const parallelSpacing = 300;   // Spacing for parallel nodes

      // Build Parent-Child Relationship Map
      architecture.connections.forEach(({ from, to }) => {
        const fromId = createNodeId(from);
        const toId = createNodeId(to);

        if (!parentChildrenMap[fromId]) {
          parentChildrenMap[fromId] = [];
        }
        parentChildrenMap[fromId].push(toId);
      });

      architecture.services.forEach((service, index) => {
        let serviceName = typeof service === 'string' ? service : service?.name;
        if (!serviceName) {
          console.warn(`⚠️ Skipping invalid service:`, service);
          return;
        }

        const serviceId = createNodeId(serviceName);
        let isMissing = serviceName.startsWith('missing_');

        let serviceIcon = getCachedServiceIcon(serviceName);
        if (isMissing) {
          serviceIcon = serviceIcon || '/aws-icons/missing.svg';
          serviceName = `Missing Service ${missingServiceCounter++}`;
        }

        const parent = Object.keys(parentChildrenMap).find(parentId =>
          parentChildrenMap[parentId].includes(serviceId)
        );

        let posX = index * horizontalSpacing; // Use increased horizontal spacing
        let posY = baseY;

        if (parent) {
          const siblings = parentChildrenMap[parent];
          const siblingIndex = siblings.indexOf(serviceId);
          const totalSiblings = siblings.length;
          
          // Adjust Y position for parallel nodes
          if (totalSiblings > 1) {
            // Calculate offset based on sibling position
            const offset = (siblingIndex - (totalSiblings - 1) / 2) * parallelSpacing;
            posY = baseY + offset;
          }
        }

        nodePositions[serviceId] = { x: posX, y: posY };

        newNodes.push({
          id: serviceId,
          type: 'awsService',
          position: { x: posX, y: posY },
          data: {
            label: serviceName,
            icon: serviceIcon,
            isMissing,
          },
        });
      });

      // Add edges with new positioning
      architecture.connections.forEach(({ from, to }) => {
        const fromId = createNodeId(from);
        const toId = createNodeId(to);

        if (!newNodes.find((node) => node.id === fromId)) {
          console.warn(`⚠️ Missing node for ${from}, skipping edge.`);
          return;
        }

        if (!newNodes.find((node) => node.id === toId)) {
          console.warn(`⚠️ Missing node for ${to}, skipping edge.`);
          return;
        }

        newEdges.push({
          id: `${fromId}-${toId}`,
          source: fromId,
          target: toId,
          sourceHandle: `${fromId}-source`,
          targetHandle: `${toId}-target`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#4FD1C5', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    }

    return () => {
      hasLoggedWarning.current = false;
    };
  }, [architecture, setNodes, setEdges]);

  if (!architecture?.services) {
    return (
      <div className="architecture-visualizer-loading">
        <span>Select the best service to add to the architecture...</span>
      </div>
    );
  }

  return (
    <div style={{ height: '600px' }} className="architecture-visualizer">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#4FD1C5" gap={16} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => node.data.isMissing ? '#FF5656' : '#4FD1C5'}
          maskColor="rgba(13, 25, 35, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export default AWSArchitectureDisplay;
