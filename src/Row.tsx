import React from 'react'
import { getCellColour } from './utils'
import { useAppSelector } from './hooks'
import { useGetCorrectWordsQuery } from './apiSlice'
interface RowProps {
  rowNumber: number
  coords: [number, number]
}

function Row(args: RowProps) {
  const { rowNumber, coords } = args
  const inputValue = useAppSelector((state) => state.game.inputValue)

  const guessedWord = useAppSelector(
    (state) => state.game.guessedWords[coords[0]][coords[1]][rowNumber]
  )

  const { data: correctWords } = useGetCorrectWordsQuery({})

  if (guessedWord && correctWords) {
    const correctWord = correctWords[coords[0]][coords[1]]
    return (
      <div className="row">
        {[...Array(5)].map((e, i) => (
          <div
            className={`cell ${getCellColour(guessedWord.toLowerCase(), correctWord.toLowerCase(), i)}`}
          >
            {guessedWord[i]}
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) => (
          <div className="cell">{inputValue[i] || ''}</div>
        ))}
      </div>
    )
  }
}

export default Row
