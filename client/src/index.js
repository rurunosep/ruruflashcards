import React from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuid } from 'uuid'
import App from './App.js'
import './style.css'

let initialCards = JSON.parse(localStorage.getItem('cards'))
if (!initialCards) {
  initialCards = [
    { front: '개', back: 'Dog', id: uuid(), enabled: true },
    { front: '고양이', back: 'Cat', id: uuid(), enabled: true },
    { front: '물고기', back: 'Fish', id: uuid(), enabled: true }
  ]
}

ReactDOM.render(
  <App initialCards={initialCards} />,
  document.getElementById('root')
)
