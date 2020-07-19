import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Quiz({ card, showNewCard, editCard }) {
  const [voices, setVoices] = useState([])
  const [filteredVoices, setFilteredVoices] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-AU')
  const [selectedVoice, setSelectedVoice] = useState()

  useEffect(function getVoices() {
    axios.get('/api/tts/voices').then((res) => setVoices(res.data))
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
      setSelectedVoice(filteredVoices[0] ? filteredVoices[0].name : undefined)
      // eslint-disable-next-line
    },
    [selectedLanguage, voices]
  )

  if (!card) card = { front: '', back: '' }

  const playTTS = () => {
    if (!voices) return

    axios
      .post(
        '/api/tts/synth',
        {
          text: flipped ? card.back : card.front,
          languageCode: selectedLanguage,
          voice: selectedVoice
        },
        { responseType: 'blob' }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(res.data)
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
    axios.get('/api/tts/langs').then((res) => setLanguageCodes(res.data))
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
