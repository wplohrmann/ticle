import React from 'react'
import { Link } from 'react-router-dom'

function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Welcome to Ticle - Tic-tac-toe meets Wordle!</h1>
      <ul>
        <li>
          <Link to="/play-locally">Play Against a Friend (Locally)</Link>
        </li>
        <li>
          <Link to="/how-to-play">How to Play</Link>
        </li>
      </ul>
    </div>
  )
}

export default MainMenu
