import React from 'react'

function Keyboard({ submitKey }) {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ]

  return (
    <>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button
              className="keyboard-key"
              key={keyIndex}
              onClick={() => submitKey(key)}
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
