import React from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#0d1923",
          },
        },
        particles: {
          color: {
            value: "#4FD1C5",
          },
          links: {
            color: "#4FD1C5",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          size: {
            value: { min: 1, max: 3 },
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
          },
        },
      }}
    />
  );
};

export default ParticleBackground; 