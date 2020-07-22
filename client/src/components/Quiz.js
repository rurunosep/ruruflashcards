import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { editCard } from '../redux/actions'

function Quiz({ cards, editCard }) {
  const [card, setCard] = useState()
  const [showNewCard, setShowNewCard] = useState(true)
  const [voices, setVoices] = useState([])
  const [filteredVoices, setFilteredVoices] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-AU')
  const [selectedVoice, setSelectedVoice] = useState()

  // TODO component should get card from state so that when cards are cleared, the displayed card is, too
  // Also, new displayed card should be chosen when cards are loaded
  // This is just a bandaid
  useEffect(() => {
    if (!cards.includes[card]) setCard(undefined)
    if (!card) setShowNewCard(true)
    // eslint-disable-next-line
  }, [cards])

  // Get voices
  useEffect(() => {
    axios.get('/api/tts/voices').then((res) => setVoices(res.data))
  }, [])

  // Filter voices
  useEffect(() => {
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
  }, [selectedLanguage, voices])

  // Show new card
  useEffect(() => {
    if (showNewCard) {
      const enabledCards = cards.filter((card) => card.enabled)
      const newCard = enabledCards[Math.floor(Math.random() * enabledCards.length)]
      setCard(newCard)
      if (newCard) setShowNewCard(false)
    }
    // eslint-disable-next-line
  }, [showNewCard, cards])

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
        <h1>{card ? (flipped ? card.back : card.front) : ''}</h1>
      </div>

      <div className='quiz-controls'>
        <button onClick={() => setFlipped(!flipped)}>Flip</button>
        <button
          onClick={() => {
            setFlipped(false)
            setShowNewCard(true)
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            editCard(card._id, { enabled: false })
            setFlipped(false)
            setShowNewCard(true)
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

function TTSOptions({ filteredVoices, selectedLanguage, selectedVoice, setLanguage, setVoice }) {
  const [languageCodes, setLanguageCodes] = useState([])

  // Get language codes
  useEffect(() => {
    axios.get('/api/tts/langs').then((res) => setLanguageCodes(res.data))
  }, [])

  return (
    <div className='tts-options'>
      <label>Language:</label>
      <select value={selectedLanguage} onChange={(e) => setLanguage(e.target.value)}>
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

const stateToProps = (state) => ({
  cards: state.cards
})

export default connect(stateToProps, { editCard })(Quiz)
