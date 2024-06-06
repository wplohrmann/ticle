import React from 'react'

interface PopUpProps {
  wordle: React.ReactNode
  popUpRef: React.RefObject<HTMLDivElement>
  keyboard: React.ReactNode
}

function PopUp(args: PopUpProps) {
  return (
    <div className="pop-up-container">
      <div ref={args.popUpRef} className="pop-up">
        <div className="pop-up-title">
        </div>
        <div className="pop-up-wordle">{args.wordle}</div>
        <div className="pop-up-keyboard">{args.keyboard}</div>
      </div>
    </div>
  )
}

export default PopUp
