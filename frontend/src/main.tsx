// Import react
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";

// Import redux
import { Provider } from 'react-redux';
import { store } from "./redux/store"

// Import app
import App from './App.tsx'

// Import styles
import './index.scss'
import './scss/styles.scss';
import './scss/variables.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
    <Provider store={store}>
      <App />
    </Provider>
    </Router>

  </React.StrictMode>,
)
