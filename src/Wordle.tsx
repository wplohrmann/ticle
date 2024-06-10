import React from 'react'
import { getPlayerColour } from './utils'
import Row from './Row'
import { useAppDispatch, useAppSelector } from './hooks'
import { gameActions } from './gameSlice'

interface WordleProps {
  coords: [number, number]
}

function Wordle(args: WordleProps) {
  const { coords } = args
  // An array of words, each array is a guessed word
  const dispatch = useAppDispatch()
  const winner = useAppSelector(
    (state) => state.game.wordleWinners[coords[0]][coords[1]]
  )
  const isActive = useAppSelector(
    (state) => state.game.activeGame?.toString() === coords.toString()
  )
  const turnColour = useAppSelector((state) =>
    getPlayerColour(state.game.currentPlayer)
  )

  const chooseGrid = () => {
    dispatch(gameActions.selectActiveGame(coords))
  }

  if (winner) {
    const colour = getPlayerColour(winner)
    return (
      <div className="game-container" onClick={chooseGrid}>
        <div className={`game-won-${colour}`}>{winner}</div>
      </div>
    )
  }
  return (
    <div
      className={`game-container ${isActive ? 'active-game-' + turnColour : ''}`}
      onClick={chooseGrid}
    >
      <div id="board">
        {[...Array(5)].map((e, i) => (
          <Row key={i} rowNumber={i} coords={coords} />
        ))}
      </div>
    </div>
  )
}

export default Wordle
