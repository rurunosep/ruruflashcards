import React from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuid } from 'uuid'
import TTS from './TTS.js'
import App from './App.js'
import './style.css'

async function main() {
  let initialCards = JSON.parse(localStorage.getItem('cards'))
  if (!initialCards) {
    initialCards = [
      { front: '개', back: 'Dog', id: uuid(), enabled: true },
      { front: '고양이', back: 'Cat', id: uuid(), enabled: true },
      { front: '물고기', back: 'Fish', id: uuid(), enabled: true },
    ]
  }

  await TTS.initialize()

  ReactDOM.render(<App initialCards={initialCards} />, document.getElementById('root'))
}

main()
