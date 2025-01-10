import React from 'react';
import AWS_ICONS from '../config/aws-icons';

const IconDebug = () => {
  return (
    <div style={{ padding: '20px', background: '#1a2935', margin: '20px', borderRadius: '8px' }}>
      <h3 style={{ color: 'white' }}>Icon Debug Panel</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        {Object.entries(AWS_ICONS).map(([key, path]) => (
          <div key={key} style={{ padding: '10px', background: '#0d1923', borderRadius: '4px' }}>
            <img 
              src={path} 
              alt={key}
              style={{ width: '32px', height: '32px' }}
              onError={(e) => console.error(`Failed to load icon: ${key} from ${path}`)}
            />
            <p style={{ margin: '5px 0', color: 'white' }}>{key}</p>
            <small style={{ color: '#4FD1C5' }}>{path}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconDebug; 