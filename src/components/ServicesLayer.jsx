import React, { useMemo } from 'react';

const ServicesLayer = ({ services, positions, getServiceIcon }) => {
  // Cache the icon URLs for all services
  const serviceIcons = useMemo(() => {
    const icons = {};
    services.forEach(service => {
      // Log each service name and its resolved icon URL
      const iconUrl = getServiceIcon(service.name);
      console.log(`🎯 Resolving icon for ${service.name}:`, iconUrl);
      icons[service.name] = iconUrl;
    });
    return icons;
  }, [services, getServiceIcon]);

  return (
    <div className="services-layer">
      {services.map((service, index) => {
        const position = positions[service.name];
        if (!position) return null;

        // Log the actual icon URL being used
        console.log(`🖼️ Rendering service ${service.name} with icon:`, serviceIcons[service.name]);

        return (
          <div
            key={`${service.name}-${index}`}
            className="service-node"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              opacity: 1 // Make sure the node is visible
            }}
          >
            <div className="service-icon">
              <img 
                src={serviceIcons[service.name]}
                alt={service.name}
                onError={(e) => {
                  console.error(`❌ Failed to load icon for ${service.name}:`, e);
                  e.target.src = '/aws-icons/default.svg';
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'block' // Ensure image is visible
                }}
              />
            </div>
            <span className="service-name">{service.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesLayer; 