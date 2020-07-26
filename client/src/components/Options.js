import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setTtsLanguage, setTtsVoice, setAutoplayTts, setReverseQuiz } from '../redux/actions'

function Options({
  ttsLanguage,
  ttsVoice,
  autoplayTts,
  reverseQuiz,
  setTtsLanguage,
  setTtsVoice,
  setAutoplayTts,
  setReverseQuiz
}) {
  const [languages, setLanguages] = useState([])
  const [voices, setVoices] = useState([])
  const [filteredVoices, setFilteredVoices] = useState([])

  // Get language codes
  useEffect(() => {
    axios.get('/api/tts/langs').then((res) => setLanguages(res.data))
  }, [])

  // Get voices
  useEffect(() => {
    axios.get('/api/tts/voices').then((res) => setVoices(res.data))
  }, [])

  // Filter voices
  useEffect(() => {
    const filteredVoices = voices
      .filter((voice) => voice.languageCodes.includes(ttsLanguage))
      .sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
      .map((voice) => voice.name)
    setFilteredVoices(filteredVoices)
    setTtsVoice(filteredVoices[0])
    // eslint-disable-next-line
  }, [ttsLanguage, voices])

  return (
    <div className='card card-no-hover'>
      <div className='row margin-none flex-spaces'>
        <div className='col'>
          <label htmlFor='language'>TTS Language:</label>
          <select
            id='language'
            value={ttsLanguage}
            onChange={(e) => setTtsLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className='col'>
          <label htmlFor='voice'>TTS Voice:</label>
          <select id='voice' value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}>
            {filteredVoices.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='row margin-none flex-spaces'>
        <div className='col'>
          <div className='form-group margin-none'>
            <label htmlFor='autoplay' className='paper-check'>
              <input
                type='checkbox'
                name='autoplay'
                id='autoplay'
                checked={autoplayTts}
                onChange={(e) => setAutoplayTts(e.target.checked)}
              />
              <span>Autoplay TTS</span>
            </label>
          </div>
        </div>
        <div className='col'>
          <div className='form-group margin-none'>
            <label htmlFor='reverse' className='paper-check'>
              <input
                type='checkbox'
                name='reverse'
                id='reverse'
                checked={reverseQuiz}
                onChange={(e) => setReverseQuiz(e.target.checked)}
              />
              <span>Quiz Back-to-Front</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state) => ({
  ttsLanguage: state.ttsLanguage,
  ttsVoice: state.ttsVoice,
  autoplayTts: state.autoplayTts,
  reverseQuiz: state.reverseQuiz
})

export default connect(stateToProps, {
  setTtsLanguage,
  setTtsVoice,
  setAutoplayTts,
  setReverseQuiz
})(Options)
