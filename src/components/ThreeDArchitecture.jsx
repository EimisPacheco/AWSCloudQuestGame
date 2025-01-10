import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDArchitecture = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add some basic geometry (you can customize this)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: '#FF9F1C', wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default ThreeDArchitecture; 