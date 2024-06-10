import React from 'react'
import { useAppDispatch } from './hooks'
import { gameActions } from './gameSlice'
import { useGetCorrectWordsQuery, useGetPossibleWordsQuery } from './apiSlice'

function Keyboard() {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ]
  const dispatch = useAppDispatch()
  const { data: correctWords } =
    useGetCorrectWordsQuery({})

  const { data: possibleWords }  =useGetPossibleWordsQuery({})

  const onClick = (key: string) => {
    console.log(key)
    if (key === "ENTER" && possibleWords && correctWords) {
      dispatch(gameActions.submitWord({possibleWords, correctWords}))
    } else if (key === "⌫") {
      dispatch(gameActions.backspace())
    } else {
      dispatch(gameActions.submitLetter(key))
    }
  }

  return (
    <>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button
              className="keyboard-key"
              key={keyIndex}
              onClick={() => onClick(key)}
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
