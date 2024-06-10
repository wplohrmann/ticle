import React from 'react'
import { useAppDispatch } from './hooks'
import { gameActions } from './gameSlice'

function Keyboard() {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ]
  const dispatch = useAppDispatch()

  return (
    <>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button
              className="keyboard-key"
              key={keyIndex}
              onClick={() => dispatch(gameActions.submitLetter(key))}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

export default Keyboard
