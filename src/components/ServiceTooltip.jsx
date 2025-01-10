import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceTooltip = ({ service, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="service-tooltip"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-details">
          <span className="category">{service.category}</span>
          <span className="pricing">{service.pricing}</span>
        </div>
        <ul className="best-practices">
          {service.bestPractices?.map((practice, index) => (
            <li key={index}>{practice}</li>
          ))}
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ServiceTooltip; 