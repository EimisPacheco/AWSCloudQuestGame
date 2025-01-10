import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHome from './components/GameHome';
import AWSArchitectureGame from './components/AWSArchitectureGame';
import CloudShooter from './components/CloudShooter';
import './styles/AWSArchitecture.css';
import { EffectsProvider } from './context/EffectsContext';

function App() {
  return (
    <EffectsProvider>
      <Router>
        <div className="app-container" style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'auto'
        }}>
          <Routes>
            <Route path="/" element={<GameHome />} />
            <Route 
              path="/cloud-shooter" 
              element={
                <div className="game-route">
                  <CloudShooter />
                </div>
              } 
            />
            <Route 
              path="/architecture-game" 
              element={
                <div className="game-route">
                  <AWSArchitectureGame />
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </EffectsProvider>
  );
}

export default App; 