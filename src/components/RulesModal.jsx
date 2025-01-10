import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/RulesModal.css';

const RulesModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button 
        className="rules-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Rules 📖' : 'Show Rules 📖'}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="rules-modal"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="rules-content">
              <h1>🎮 Game Rules: Legendary Lines Game! 🎭</h1>
              <p>Welcome, word wizard! 🌟 Here's how to play this thrilling game of wit and wisdom!</p>

              <section>
                <h2>📝 How to Play:</h2>
                <ol>
                  <li>Start the Game: Click the "Start Game" to begin your adventure! 🚀</li>
                  <li>Choose Your Nickname: Pick an epic nickname to be remembered by! 🦸‍♂️🦸‍♀️</li>
                  <li>Set the Rounds: Decide how many rounds you'd like to play (up to 10). 🎯</li>
                  <li>Pick a Category: Choose a category from the list below:</li>
                  <ul>
                    <li>🎵 Song (1 point)</li>
                    <li>🎬 Movie (2 points)</li>
                    <li>🧑‍🎤 Famous Person (3 points)</li>
                    <li>🦸 Fictional Character (3 points)</li>
                    <li>📚 Book (4 points)</li>
                    <li>✒️ Poet (5 points)</li>
                    <li>💬 Quote (6 points)</li>
                  </ul>
                </ol>
              </section>

              <section>
                <h2>🚀 Gameplay:</h2>
                <p>You'll be given a phrase. Your job? Guess its source!<br/>
                (Is it from a song, movie, book, etc.?)<br/>
                Correct Guess: You score the points for that category! 🎉</p>
              </section>

              <section>
                <h2>💥 Bonus Points:</h2>
                <h3>Double Your Points!</h3>
                <p>After a correct guess, you can double your score by guessing the year it originated.</p>
                <ul>
                  <li>If correct: 🎉 Double points!</li>
                  <li>If incorrect: 😢 You lose all points for that round.</li>
                </ul>

                <h3>Triple Your Points! (Only for Movies & Songs):</h3>
                <ul>
                  <li>Movies: Guess the director to triple your points. 🎬</li>
                  <li>Songs: Name the band/singer to triple your points. 🎤</li>
                  <li>Books: Name the author to triple your points. 📚</li>
                  <li>If correct: 🌟 Epic triple points!</li>
                  <li>If incorrect: 😞 All points lost for that round!</li>
                </ul>
              </section>

              <section>
                <h2>😇 Keeping Your Points:</h2>
                <p>Not feeling lucky? You can skip the bonus challenge and keep your points!</p>
              </section>

              <section>
                <h2>📊 End of the Game:</h2>
                <p>Perfect Score: You're a legend! 🏆💯<br/>
                Not Perfect? You still rocked it—try again to beat your score! 🔄</p>
              </section>

              <p className="rules-footer">🎭 Ready to show off your knowledge? Hit "Start Game" to begin! ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RulesModal; 