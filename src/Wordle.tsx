import React, { useState } from 'react';
import { getPlayerColour } from './utils';
import Row from './Row';

function Wordle(args) {
  const {onWin, player, changePlayer, isActive, coords, winner, chooseGrid, turnColour, possibleWords, wordState, setWordState, exitPopUp, isPopUp, correctWord} = args;
  // An array of words, each array is a guessed word
  const currentRow = wordState.length;
  const [finished, setFinished] = useState(false);

  const guessWord = (word) => {
    if (!possibleWords.includes(word.toLowerCase())) {
      return;
    }
    setWordState([...wordState, word]);
    if (word.toLowerCase() === correctWord.toLowerCase()) {
      setFinished(true);
      onWin(player);
    }
    changePlayer();
  }
  if (winner) {
    const colour = getPlayerColour(winner);
    return (<div className="game-container" onClick={chooseGrid}>
       <div className={`game-won-${colour}`}>{winner}</div>
      </div>)
  }
  return (
    <div className={`game-container ${isActive ? 'active-game-' + turnColour : ''}`} onClick={chooseGrid}>
      <div id="board">
          {[...Array(5)].map((e, i) => <Row
            guessWord={(i === currentRow && !finished && isPopUp) ? guessWord : null}
            guessedWord={(i < wordState.length) ? wordState[i] : null}
            correctWord={correctWord}
            isActive={isActive}
            coords={coords}
            exitPopUp={exitPopUp}
          />)}
      </div>
    </div>
  )
}

export default Wordle;
