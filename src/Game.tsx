import React, { useEffect, useRef } from 'react'
import PopUp from './PopUp'
import Wordle from './Wordle'
import { getPlayerColour } from './utils'
import './App.css'
import Keyboard from './Keyboard'
import { useAppDispatch, useAppSelector } from './hooks'
import { gameActions } from './gameSlice'
import { useGetCorrectWordsQuery, useGetPossibleWordsQuery } from './apiSlice'

function Game() {
  const dispatch = useAppDispatch()
  const wordleWinners = useAppSelector((state) => state.game.wordleWinners)
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer)
  const activeGame = useAppSelector((state) => state.game.activeGame)
  const popUpRef = useRef(null)

  const { data: correctWords, isLoading: isCorrectWordsLoading } =
    useGetCorrectWordsQuery({})

  const { isLoading: isLoadingPossibleWords } = useGetPossibleWordsQuery({})

  const isLoading = isCorrectWordsLoading || isLoadingPossibleWords

  useEffect(() => {
    function handleClickOutside(event) {
      console.log('Click!', popUpRef.current, event.target)
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        dispatch(gameActions.exitPopUp())
      }
    }

    // Attach the listeners on component mount.
    document.addEventListener('mousedown', handleClickOutside)
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [popUpRef, dispatch])

  useEffect(() => {
    function handleKeyPress(event) {
      if (activeGame === null && /^[1-9]$/.test(event.key)) {
        dispatch(
          gameActions.selectActiveGame([
            Math.floor((event.key - 1) / 3),
            (event.key - 1) % 3,
          ])
        )
      } else if (event.key === 'Escape') {
        dispatch(gameActions.exitPopUp())
      } else if (event.key === 'Enter') {
        dispatch(gameActions.submitWord())
      } else if (event.key === 'Backspace') {
        dispatch(gameActions.backspace())
      } else if (event.key.length === 1) {
        dispatch(gameActions.submitLetter(event.key))
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [activeGame, dispatch])

  const turnColour = getPlayerColour(currentPlayer)

  if (isLoading) {
    return <div>Loading...</div>
  }
  const wordles = wordleWinners.map((row, i) =>
    row.map((winner, j) => (
      <Wordle
        correctWord={correctWords[i][j]}
        player={currentPlayer}
        coords={[i, j]}
        isActive={
          activeGame !== null && activeGame[0] === i && activeGame[1] === j
        }
        isPopUp={false}
        winner={winner}
      />
    ))
  )
  let inputWordle = null
  let inputKeyBoard = null
  if (activeGame !== null) {
    const [i, j] = activeGame
    inputWordle = <Wordle coords={[i, j]} isPopUp={true} />
    inputKeyBoard = (
      <Keyboard submitKey={() => true} /> // TODO
    )
  }
  return (
    <>
      <div className="game-title">
        Turn: <span style={{ color: turnColour }}>{currentPlayer}</span>
      </div>
      <div style={{ position: 'relative' }}>
        {activeGame !== null && (
          <PopUp
            popUpRef={popUpRef}
            wordle={inputWordle}
            keyboard={inputKeyBoard}
          />
        )}
        <div className="game-grid">{wordles}</div>
      </div>
    </>
  )
}

export default Game
