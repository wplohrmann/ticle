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
  const popUpRef = useRef<HTMLDivElement>(null)

  const { data: correctWords, isLoading: isCorrectWordsLoading } =
    useGetCorrectWordsQuery({})

  const { data: possibleWords, isLoading: isLoadingPossibleWords } =
    useGetPossibleWordsQuery({})

  const isLoading = isCorrectWordsLoading || isLoadingPossibleWords

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popUpRef.current &&
        event.target !== null &&
        !popUpRef.current.contains(event.target as Node)
      ) {
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
    function handleKeyPress(event: KeyboardEvent) {
      if (activeGame === null && /^[1-9]$/.test(event.key)) {
        const keyNumber = parseInt(event.key)
        dispatch(
          gameActions.selectActiveGame([
            Math.floor((keyNumber - 1) / 3),
            (keyNumber - 1) % 3,
          ])
        )
      } else if (event.key === 'Escape') {
        dispatch(gameActions.exitPopUp())
      } else if (
        event.key === 'Enter' &&
        correctWords !== undefined &&
        possibleWords !== undefined
      ) {
        dispatch(gameActions.submitWord({ possibleWords, correctWords }))
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
  }, [activeGame, dispatch, correctWords, possibleWords])

  const turnColour = getPlayerColour(currentPlayer)

  if (isLoading) {
    return <div>Loading...</div>
  }
  const wordles = wordleWinners.map((row, i) =>
    row.map((_, j) => <Wordle coords={[i, j]} />)
  )
  let inputWordle = null
  let inputKeyBoard = null
  if (activeGame !== null) {
    const [i, j] = activeGame
    inputWordle = <Wordle coords={[i, j]} />
    inputKeyBoard = <Keyboard />
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
