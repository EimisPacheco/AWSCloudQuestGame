import React from 'react';
import DraggableService from './DraggableService';

const ServiceOptionsPanel = ({ options = [], onSelect, isLoading }) => {
  if (isLoading) {
    return <div className="options-container loading">Loading options...</div>;
  }

  if (!Array.isArray(options) || options.length === 0) {
    return <div className="options-container empty">No options available</div>;
  }

  return (
    <div className="options-container">
      {options.map((service) => {
        if (!service) return null;
        
        return (
          <DraggableService 
            key={service.id || 'unknown'}
            service={service}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};

export default ServiceOptionsPanel; 