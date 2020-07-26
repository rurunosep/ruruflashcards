import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

let initialState = {
  cards: [],
  username: null,
  ttsLanguage: 'fr-FR',
  ttsVoice: null,
  autoplayTts: false,
  reverseQuiz: false,
  registerModalOpen: false,
  addCardModalOpen: false,
  editCardModalOpen: false,
  editCardId: null,
  errorMessage: null
}

// Load options from local storage
const options = JSON.parse(localStorage.getItem('options')) || {}
initialState = {
  ...initialState,
  ttsLanguage: options.ttsLanguage ? options.ttsLanguage : initialState.ttsLanguage,
  ttsVoice: options.ttsVoice ? options.ttsVoice : initialState.ttsVoice,
  autoplayTts: options.autoplayTts ? options.autoplayTts : initialState.autoplayTts,
  reverseQuiz: options.reverseQuiz ? options.reverseQuiz : initialState.reverseQuiz
}

const enhancers = compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
)

const store = createStore(reducer, initialState, enhancers)

// Save options to local storage
store.subscribe(() => {
  const { ttsLanguage, ttsVoice, autoplayTts, reverseQuiz } = store.getState()
  localStorage.setItem(
    'options',
    JSON.stringify({ ttsLanguage, ttsVoice, autoplayTts, reverseQuiz })
  )
})

export default store
