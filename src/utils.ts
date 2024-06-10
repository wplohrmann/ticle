export function getPlayerColour(player: 'X' | 'O') {
  return player === 'X' ? 'red' : 'blue'
}

export function getCellColour(
  guessedWord: string,
  correctWord: string,
  i: number
): string {
  const remainingToGuess = correctWord
    .split('')
    .filter((letter, index) => letter !== guessedWord[index])
  if (guessedWord[i] === correctWord[i]) {
    return 'green'
  } else if (remainingToGuess.includes(guessedWord[i])) {
    return 'yellow'
  } else {
    return 'gray'
  }
}
