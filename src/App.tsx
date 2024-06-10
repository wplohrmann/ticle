import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import MainMenu from './MainMenu'
import HowToPlay from './HowToPlay'
import Game from './Game'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={MainMenu} />
        <Route path="/how-to-play" Component={HowToPlay} />
        <Route path="/play-locally" Component={Game} />
      </Routes>
    </Router>
  )
}
export default App
