import React from 'react';

const ConnectionsLayer = ({ services, connections, positions }) => {
  return (
    <svg className="connections-layer">
      {connections && connections.map((connection, index) => {
        const fromPos = positions[connection.from];
        const toPos = positions[connection.to];
        
        if (!fromPos || !toPos) return null;

        return (
          <line
            key={`${connection.from}-${connection.to}-${index}`}
            x1={fromPos.x + 60}
            y1={fromPos.y + 50}
            x2={toPos.x + 60}
            y2={toPos.y + 50}
            stroke="#4FD1C5"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
};

export default ConnectionsLayer; 