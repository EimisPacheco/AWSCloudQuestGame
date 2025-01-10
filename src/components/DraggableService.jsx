import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableService = ({ service, onClick }) => {
  return (
    <div 
      className="draggable-service"
      onClick={onClick}
    >
      <div className="service-icon">
        <img 
          src={service.icon}
          alt={service.name}
          onError={(e) => {
            console.error(`❌ Failed to load icon for ${service.name}:`, e);
            e.target.src = '/aws-icons/default.svg';
          }}
          style={{
            width: '48px',
            height: '48px',
            display: 'block'
          }}
        />
      </div>
      <span className="service-name">{service.name}</span>
    </div>
  );
};

export default DraggableService; 