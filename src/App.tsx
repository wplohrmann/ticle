import React, { useState, useEffect, useRef } from 'react'
import HowToPlay from './HowToPlay'
import PopUp from './PopUp'
import Wordle from './Wordle'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { getPlayerColour } from './utils'
import './App.css'
import Keyboard from './Keyboard'

function Game() {
  const [gameState, setGameState] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState('O')
  const [activeGame, setActiveGame] = useState(null)
  const [correctWords, setcorrectWords] = useState(null)
  const [possibleWords, setPossibleWords] = useState(null)
  const [wordState, setWordState] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill([]))
  )
  const popUpRef = useRef(null)

  const setIndividualWordState = (i, j, word) => {
    setWordState(
      wordState.map((row, x) =>
        row.map((cell, y) => (x === i && y === j ? word : cell))
      )
    )
  }

  const handleWin = (player, x, y) => {
    setGameState(
      gameState.map((row, i) =>
        row.map((cell, j) => (i === x && j === y ? player : cell))
      )
    )
  }
  const chooseGrid = (i, j) => {
    setActiveGame([i, j])
  }

  useEffect(() => {
    fetch('/answer_words.txt')
      .then((response) => response.text())
      .then((data) => {
        const words = data.split('\n')

        // Function to generate a random index
        const getRandomIndex = (max) => Math.floor(Math.random() * max)

        // Create a 3x3 array and fill it with random words from the array
        setcorrectWords(
          Array(3)
            .fill(null)
            .map(() =>
              Array(3)
                .fill(null)
                .map(() => words[getRandomIndex(words.length)])
            )
        )
      })
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      console.log('Click!', popUpRef.current, event.target)
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setActiveGame(null)
      }
    }

    // Attach the listeners on component mount.
    document.addEventListener('mousedown', handleClickOutside)
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setActiveGame, popUpRef])

  useEffect(() => {
    function handleKeyPress(event) {
      if (activeGame === null && /^[1-9]$/.test(event.key)) {
        setActiveGame([Math.floor((event.key - 1) / 3), (event.key - 1) % 3])
      } else if (exitPopUp && event.key === 'Escape') {
        setActiveGame(null)
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [activeGame])

  useEffect(() => {
    const asyncEffect = async () => {
      const possibleWords = await fetch('/possible_words.txt')
        .then((response) => response.text())
        .then((data) => data.split('\n'))
      setPossibleWords(possibleWords)
    }
    asyncEffect()
  }, [])

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }
  const turnColour = getPlayerColour(currentPlayer)

  const exitPopUp = () => {
    setActiveGame(null)
  }

  if (correctWords === null || possibleWords === null) {
    return <div>Loading...</div>
  }
  const wordles = gameState.map((row, i) =>
    row.map((winner, j) => (
      <Wordle
        correctWord={correctWords[i][j]}
        player={currentPlayer}
        coords={[i, j]}
        wordState={wordState[i][j]}
        isActive={
          activeGame !== null && activeGame[0] === i && activeGame[1] === j
        }
        isPopUp={false}
        winner={winner}
        chooseGrid={() => chooseGrid(i, j)}
        turnColour={turnColour}
      />
    ))
  )
  let inputWordle = null
  let inputKeyBoard = null
  if (activeGame !== null) {
    const [i, j] = activeGame
    inputWordle = (
      <Wordle
        correctWord={correctWords[i][j]}
        player={currentPlayer}
        onWin={(player) => handleWin(player, i, j)}
        coords={[i, j]}
        wordState={wordState[i][j]}
        isActive={true}
        isPopUp={true}
        changePlayer={changePlayer}
        possibleWords={possibleWords}
        setWordState={(words) => setIndividualWordState(i, j, words)}
        exitPopUp={() => setActiveGame(null)}
      />
    )
    inputKeyBoard = (
      <Keyboard submitKey={() => true}/> // TODO
    )
  }
  return (
    <>
      <div className="game-title">
        Turn: <span style={{ color: turnColour }}>{currentPlayer}</span>
      </div>
      <div style={{ position: 'relative' }}>
        {activeGame !== null && (
          <PopUp popUpRef={popUpRef} wordle={inputWordle} keyboard={inputKeyBoard}/>
        )}
        <div className="game-grid">{wordles}</div>
      </div>
    </>
  )
}

function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Welcome to Ticle - Tic-tac-toe meets Wordle!</h1>
      <ul>
        <li>
          <Link to="/play-locally">Play Against a Friend (Locally)</Link>
        </li>
        <li>
          <Link to="/how-to-play">How to Play</Link>
        </li>
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
        <Route path="/popup" Component={PopUp} />
      </Routes>
    </Router>
  )
}
export default App
