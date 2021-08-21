import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

function renderApp () {
    const mountEl = document.getElementById('react-app')

    ReactDOM.render(<App />, mountEl)
}

renderApp()