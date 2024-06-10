import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { Provider } from 'react-redux'
import store from './store'

const rootNode = document.getElementById('root')
if (rootNode !== null) {
  const root = ReactDOM.createRoot(rootNode)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}
