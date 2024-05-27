import React, { useState, useEffect, useMemo } from 'react';
import HowToPlay from './HowToPlay';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

function Row(args) {
  const {guessWord, guessedWord, correctWord, isActive, coords} = args;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isActive || guessWord === null) {
      setInputValue('');
    }
  })

  const handleKeyPress = (event) => {
    if (!isActive || guessWord === null) {
      return
    }
    if (event.key === 'Enter' && inputValue.length === 5) {
      guessWord(inputValue);
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    } else if (event.key.length === 1 && inputValue.length < 5) {
      if (/^[a-zA-Z]$/.test(event.key)) {
        setInputValue(inputValue + event.key);
      }
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
  const {correctWord, onWin, player, changePlayer, isActive, coords, winner, chooseGrid, turnColour, possibleWords} = args;
  // An array of words, each array is a guessed word
  const [wordState, setWordState] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [finished, setFinished] = useState(false);

  const guessWord = (word) => {
    if (!possibleWords.includes(word.toLowerCase())) {
      // console.log(possibleWords)
      // console.log(word)
      return;
    }
    setWordState([...wordState, word]);
    setCurrentRow(currentRow + 1);
    if (word.toLowerCase() === correctWord.toLowerCase()) {
      setFinished(true);
      onWin(player);
    }
    changePlayer();
  }
  if (finished) {
    const colour = getPlayerColour(winner);
    return (<div className="game-container">
       <div className={`game-won-${colour}`}>{winner}</div>
      </div>)
  }
  return (
    <div className={`game-container ${isActive ? 'active-game-' + turnColour : ''}`} onClick={chooseGrid}>
      <div id="board">
          {[...Array(5)].map((e, i) => <Row
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

function getPlayerColour(player) {
  return player === "X" ? "red" : "blue";
}


function Game() {
  const [gameState, setGameState] = useState(Array(3).fill().map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('O');
  const [activeGame, setActiveGame] = useState([0, 0]);
  const [correctWords, setcorrectWords] = useState(null);
  const [possibleWords, setPossibleWords] = useState(null);

  const handleWin = (player, x, y) => {
    setGameState(gameState.map((row, i) => row.map((cell, j) => i === x && j === y ? player : cell)));
  }
  const chooseGrid = (i, j) => {
    setActiveGame([i, j]);
  }

  useEffect(() => {
    fetch('/answer_words.txt')
      .then(response => response.text())
      .then(data => {
        const words = data.split('\n');

        // Function to generate a random index
        const getRandomIndex = (max) => Math.floor(Math.random() * max);

        // Create a 3x3 array and fill it with random words from the array
        setcorrectWords(Array(3).fill().map(() => Array(3).fill().map(() => words[getRandomIndex(words.length)])));

      });
  }, [])

  useEffect(async () => {
    const possibleWords = await fetch('/possible_words.txt')
      .then(response => response.text())
      .then(data => data.split('\n'));
    const answerWords = await fetch('/answer_words.txt')
      .then(response => response.text())
      .then(data => data.split('\n'));
    setPossibleWords([...possibleWords, ...answerWords]);
  }, [])


  const turnColour = getPlayerColour(currentPlayer);

  if (correctWords === null) {
    return <div>Loading...</div>
  }
  return (<>
    <div className="game-title">Turn: <span style={{color: turnColour}}>{currentPlayer}</span></div>
    <div className="game-grid">
      {gameState.map((row, i) => row.map((winner, j) =>
        <Wordle
          correctWord={correctWords[i][j]}
          onWin={(player) => handleWin(player, i, j)}
          changePlayer={() => setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')}
          player={currentPlayer}
          isActive={activeGame[0] === i && activeGame[1] === j}
          coords={[i, j]}
          winner={winner}
          chooseGrid={() => chooseGrid(i, j)}
          turnColour={turnColour}
          possibleWords={possibleWords}
        />
      ))}
    </div>
  </>)
}

function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Welcome to Ticle - Tic-tac-toe meets Wordle!</h1>
      <ul>
        <li><Link to="/play-locally">Play Against a Friend (Locally)</Link></li>
        <li><Link to="/how-to-play">How to Play</Link></li>
      </ul>
    </div>
  )

}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={MainMenu} />
        <Route path="/how-to-play" Component={HowToPlay} />
        <Route path="/play-locally" Component={Game} />
      </Routes>
    </Router>
  );
}
export default App;
