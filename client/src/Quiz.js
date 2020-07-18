import React, { useState, useEffect } from 'react'

function Quiz({ card, showNewCard, editCard }) {
  const [voices, setVoices] = useState([])
  const [filteredVoices, setFilteredVoices] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-AU')
  const [selectedVoice, setSelectedVoice] = useState()

  useEffect(function getVoices() {
    fetch('http://localhost:5000/api/voices')
      .then((res) => {
        if (res.status === 500) {
          throw Error(500)
        } else {
          return res.json()
        }
      })
      .then((json) => setVoices(json))
      .catch()
  }, [])

  useEffect(
    function filterVoices() {
      const filteredVoices = voices
        .filter((voice) => voice.languageCodes.includes(selectedLanguage))
        .sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      setFilteredVoices(filteredVoices)
      setSelectedVoice(filteredVoices[0])
      // eslint-disable-next-line
    },
    [selectedLanguage, voices]
  )

  if (!card) card = { front: '', back: '' }

  const playTTS = () => {
    if (!voices) return

    fetch('http://localhost:5000/api/synthesizeSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: flipped ? card.back : card.front,
        languageCode: selectedLanguage,
        voice: selectedVoice.name
      })
    })
      .then((res) => res.blob())
      .then((audioData) => {
        const url = window.URL.createObjectURL(audioData)
        const audio = new Audio(url)
        audio.play()
      })
  }

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
        <button onClick={playTTS} disabled={!voices[0]}>
          Play
        </button>
      </div>

      {voices[0] && (
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

function TTSOptions({
  filteredVoices,
  selectedLanguage,
  selectedVoice,
  setLanguage,
  setVoice
}) {
  const [languageCodes, setLanguageCodes] = useState([])

  useEffect(function getLanguageCodes() {
    fetch('http://localhost:5000/api/languageCodes')
      .then((res) => {
        if (res.status === 500) {
          throw Error(500)
        } else {
          return res.json()
        }
      })
      .then((json) => setLanguageCodes(json))
      .catch()
  }, [])

  return (
    <div className='tts-options'>
      <label>Language:</label>
      <select
        value={selectedLanguage}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languageCodes.map((lang) => (
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
