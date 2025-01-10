import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GameHome-h.css';

const GameHome = () => {
  return (
    <div className="aws-game-home">
      <div className="game-home-wrapper-h">
        <div className="game-home-container-h">
          <h1 className="game-title-h">AWS GAME HUB</h1>
          <div className="games-grid-h">
            <div className="game-card-h hover-glow">
              <Link to="/cloud-shooter" className="game-link-h">
                <div className="game-icon-h">
                  <span className="icon-target">🎯</span>
                </div>
                <h2>AWS Cloud Shooter</h2>
                <h3> Rocket Blast Mode </h3>
                <p>Test your AWS knowledge in a fast-paced shooting icon game!</p>
              </Link>
            </div>

            <div className="game-card-h hover-glow">
              <Link to="/architecture-game" className="game-link-h">
                <div className="game-icon-h">
                  <span className="icon-puzzle">🧩</span>
                </div>
                <h2>Architecture Puzzle</h2>
                <h3>Architecture Builder Mode </h3>
                <p>Complete AWS architecture diagrams by finding the missing services!</p>
              </Link>
            </div>
          </div>
          <center>
            <img 
              src="https://hackthon-backend-files-ep-2024.s3.us-east-1.amazonaws.com/amazon-icons-set/Architecture-Service-Icons_06072024/AWSHomeGame.webp"
              alt="Loading..." 
              style={{ 
                width: '1100px',
                height: '800px',
                verticalAlign: 'middle',
                display: 'inline-block',
                borderRadius: '50px'
              }} 
            />
          </center>
        </div>
      </div>
    </div>
  );
};

export default GameHome;