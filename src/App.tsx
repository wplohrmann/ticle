import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import MainMenu from './MainMenu'
import HowToPlay from './HowToPlay'
import Game from './Game'
import PopUp from './PopUp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={MainMenu} />
        <Route path="/how-to-play" Component={HowToPlay} />
        <Route path="/play-locally" Component={Game} />
        <Route path="/popup" Component={PopUp} />
      </Routes>
    </Router>
  )
}
export default App
