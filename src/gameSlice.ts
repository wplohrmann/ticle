import { createSlice } from '@reduxjs/toolkit'

export type GameState = {
  currentPlayer: 'X' | 'O'
  activeGame: [number, number] | null
  wordleWinners: ('X' | 'O' | null)[][]
  inputValue: string
  guessedWords: string[][][]
}

function emptyGrid<T>(value: T): T[][] {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(value))
}

const initialState: GameState = {
  currentPlayer: 'X',
  activeGame: null,
  wordleWinners: emptyGrid(null),
  inputValue: '',
  guessedWords: emptyGrid([]),
}

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    changePlayer: (state) => {
      state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X'
    },
    selectActiveGame: (state, action: { payload: [number, number] }) => {
      state.activeGame = action.payload
    },
    exitPopUp: (state) => {
      state.activeGame = null
    },
    submitLetter: (state, action: { payload: string }) => {
      if (!/^[a-zA-Z]$/.test(action.payload)) {
        return
      }
      if (state.inputValue.length < 5) {
        state.inputValue += action.payload
      }
    },
    backspace: (state) => {
      if (state.inputValue.length > 0) {
        state.inputValue = state.inputValue.slice(0, -1)
      }
    },
    submitWord: (
      state,
      action: { payload: { possibleWords: string[]; correctWords: string[][] } }
    ) => {
      if (
        state.activeGame === null ||
        state.inputValue.length < 5 ||
        action.payload.possibleWords.length === 0
      ) {
        // TODO: Display an error message
        return
      }
      if (state.inputValue.length === 5) {
        if (
          !action.payload.possibleWords.includes(state.inputValue.toLowerCase())
        ) {
          return
        }
        const correctWord =
          action.payload.correctWords[state.activeGame[0]][state.activeGame[1]]
        if (state.inputValue.toLowerCase() === correctWord.toLowerCase()) {
          state.wordleWinners[state.activeGame[0]][state.activeGame[1]] =
            state.currentPlayer
        }
        state.guessedWords[state.activeGame[0]][state.activeGame[1]].push(
          state.inputValue
        )
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X'
        state.inputValue = ''
      }
    },
  },
})

export const gameActions = gameSlice.actions
