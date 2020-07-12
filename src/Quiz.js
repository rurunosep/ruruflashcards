import React, { useState, useEffect } from 'react'
import TTS from './TTS.js'

function Quiz({ card, showNewCard, editCard }) {
  const [flipped, setFlipped] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-AU')
  const [selectedVoice, setSelectedVoice] = useState()

  const filteredVoices = TTS.voices
    .filter((voice) => voice.languageCodes.includes(selectedLanguage))
    .sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

  useEffect(() => {
    setSelectedVoice(filteredVoices[0])
  }, [selectedLanguage, filteredVoices])

  if (!card) card = { front: '', back: '' }

  return (
    <div className='quiz'>
      <div className='card-display'>
        <h1>{flipped ? card.back : card.front}</h1>
      </div>

      <div className='quiz-controls'>
        <button onClick={() => setFlipped(!flipped)}>Flip</button>
        <button
          onClick={() => {
            setFlipped(false)
            showNewCard()
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            editCard({ enabled: false })
            setFlipped(false)
            showNewCard()
          }}
        >
          Disable
        </button>
        <button
          onClick={() =>
            TTS.play(flipped ? card.back : card.front, selectedLanguage, selectedVoice)
          }
          disabled={!TTS.client}
        >
          Play
        </button>
      </div>

      {TTS.client && (
        <TTSOptions
          filteredVoices={filteredVoices}
          selectedLanguage={selectedLanguage}
          selectedVoice={selectedVoice}
          setLanguage={setSelectedLanguage}
          setVoice={setSelectedVoice}
        />
      )}
    </div>
  )
}

function TTSOptions({ filteredVoices, selectedLanguage, selectedVoice, setLanguage, setVoice }) {
  return (
    <div className='tts-options'>
      <label>Language:</label>
      <select value={selectedLanguage} onChange={(e) => setLanguage(e.target.value)}>
        {TTS.languageCodes.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <label>Voice:</label>
      <select value={selectedVoice} onChange={(e) => setVoice(e.target.value)}>
        {filteredVoices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Quiz
