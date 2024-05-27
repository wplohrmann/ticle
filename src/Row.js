import React, {useState, useEffect} from 'react';
function Row(args) {
  const {guessWord, guessedWord, correctWord, isActive, coords, exitPopUp} = args;
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isActive || guessWord === null) {
      setInputValue('');
    }
  })

  const handleKeyPress = (event) => {
    if (!isActive || guessWord === null) {
      return
    }
    if (event.key === 'Enter' && inputValue.length === 5) {
      guessWord(inputValue);
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    }  else if (event.key.length === 1 && inputValue.length < 5) {
      if (/^[a-zA-Z]$/.test(event.key)) {
        setInputValue(inputValue + event.key);
      }
    }
  }
  const getCellColor = (guessedLetter, correctLetter) => {
    const lowerGuessedLetter = guessedLetter.toLowerCase();
    const lowerCorrectLetter = correctLetter.toLowerCase();

    if (lowerGuessedLetter === lowerCorrectLetter) {
      return "green";
    } else if (correctWord.toLowerCase().includes(lowerGuessedLetter)) {
      return "yellow";
    } else {
      return "gray";
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    }
  }, [inputValue, guessWord]); // Re-run the effect when `inputValue` change

  if (guessedWord !== null) {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) =>
          <div className={`cell ${getCellColor(guessedWord[i], correctWord[i])}`}>
            {guessedWord[i]}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) => <div className="cell">{inputValue[i] || ""}</div>)}
      </div>
    )
  }
}

export default Row;
