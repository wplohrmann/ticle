import React, { useState, useEffect } from 'react';
import './App.css';

function Row(args) {
  const {guessWord, guessedWord, correctWord, isActive, coords} = args;
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event) => {
    console.log("key pressed", coords, isActive);
    if (!isActive || guessWord === null) {
      return
    }
    if (event.key === 'Enter' && inputValue.length === 5) {
      guessWord(inputValue);
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    } else if (event.key.length === 1 && inputValue.length < 5) {
      setInputValue(inputValue + event.key);
    }
  }
  const getCellColor = (guessedLetter, correctLetter) => {
    const lowerGuessedLetter = guessedLetter.toLowerCase();
    const lowerCorrectLetter = correctLetter.toLowerCase();

    if (lowerGuessedLetter === lowerCorrectLetter) {
      return "green";
    } else if (correctWord.toLowerCase().includes(lowerGuessedLetter)) {
      return "yellow";
    } else {
      return "gray";
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    }
  }, [inputValue, guessWord]); // Re-run the effect when `inputValue` change

  if (guessedWord !== null) {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) =>
          <div className={`cell ${getCellColor(guessedWord[i], correctWord[i])}`}>
            {guessedWord[i]}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) => <div className="cell">{inputValue[i] || ""}</div>)}
      </div>
    )
  }
}

function Wordle(args) {
  const {correctWord, onWin, player, changePlayer, isActive, coords, winner, chooseGrid} = args;
  console.log("isActive", coords, isActive);
  // An array of words, each array is a guessed word
  const [wordState, setWordState] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [finished, setFinished] = useState(false);

  const guessWord = (word) => {
    setWordState([...wordState, word]);
    setCurrentRow(currentRow + 1);
    if (word.toLowerCase() === correctWord.toLowerCase()) {
      setFinished(true);
      onWin(player);
    }
    changePlayer();
  }
  if (finished) {
    return (<div class="game-container">
       <div class="game-won">{winner}</div>
      </div>)
  }
  return (
    <div className={`game-container ${isActive ? 'active-game' : ''}`} onClick={chooseGrid}>
      <div id="board">
          {[...Array(6)].map((e, i) => <Row
            guessWord={(i === currentRow && !finished) ? guessWord : null}
            correctWord={correctWord}
            guessedWord={(i < wordState.length) ? wordState[i] : null}
            isActive={isActive}
            coords={coords}
          />)}
      </div>
    </div>
  )
}

function App() {
  const [gameState, setGameState] = useState(Array(3).fill().map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('O');
  const [activeGame, setActiveGame] = useState([0, 0]);

  const handleWin = (player, x, y) => {
    setGameState(gameState.map((row, i) => row.map((cell, j) => i === x && j === y ? player : cell)));
    setActiveGame([activeGame[0] + 1, activeGame[1] + 1]);
  }
  const chooseGrid = (i, j) => {
    setActiveGame([i, j]);
  }

  return (
    <div className="game-grid">
      {gameState.map((row, i) => row.map((winner, j) =>
        <Wordle
          correctWord="APPLE"
          onWin={(player) => handleWin(player, i, j)}
          changePlayer={() => setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')}
          player={currentPlayer}
          isActive={activeGame[0] === i && activeGame[1] === j}
          coords={[i, j]}
          winner={winner}
          chooseGrid={() => chooseGrid(i, j)}
        />
      ))}
    </div>
  )
}
export default App;
