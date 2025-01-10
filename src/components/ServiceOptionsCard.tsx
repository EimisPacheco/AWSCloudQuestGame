import React from 'react';
import { motion } from 'framer-motion';

interface ServiceOption {
  id: string;
  name: string;
  icon: string;
}

interface Props {
  options: ServiceOption[];
  onSelect: (serviceId: string) => void;
}

const ServiceOptionsCard: React.FC<Props> = ({ options, onSelect }) => {
  return (
    <div className="service-options">
      <h3>Select the Missing Service</h3>
      <div className="options-grid">
        {options.map(option => (
          <motion.div
            key={option.id}
            className="service-option"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelect(option.id)}
          >
            <img src={option.icon} alt={option.name} />
            <span>{option.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceOptionsCard; 