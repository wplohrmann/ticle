import React, { useState, useEffect } from "react";
import { getCellColour } from "./utils";
function Row(args) {
  const { guessWord, guessedWord, correctWord, isActive, coords, exitPopUp } =
    args;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isActive || guessWord === null) {
      setInputValue("");
    }
  });

  const handleKeyPress = (event) => {
    if (!isActive || guessWord === null) {
      return;
    }
    if (event.key === "Enter" && inputValue.length === 5) {
      guessWord(inputValue);
      setInputValue("");
    } else if (event.key === "Backspace" && inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    } else if (event.key.length === 1 && inputValue.length < 5) {
      if (/^[a-zA-Z]$/.test(event.key)) {
        setInputValue(inputValue + event.key);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputValue, guessWord]); // Re-run the effect when `inputValue` change

  if (guessedWord !== null) {
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
    );
  } else {
    return (
      <div className="row">
        {[...Array(5)].map((e, i) => (
          <div className="cell">{inputValue[i] || ""}</div>
        ))}
      </div>
    );
  }
}

export default Row;
