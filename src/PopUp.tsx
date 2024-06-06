import React from 'react'

function PopUp({ wordle, popUpRef, keyboard }) {
  return (
    <div className="pop-up-container">
      <div ref={popUpRef} className="pop-up">
        <div className="pop-up-title">
          Hello bby. How are you? Thanks for bookingtickts
        </div>
        <div className="pop-up-wordle">{wordle}</div>
        <div className="pop-up-keyboard">{keyboard}</div>
      </div>
    </div>
  )
}

export default PopUp
