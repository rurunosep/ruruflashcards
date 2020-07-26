export default function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_CARDS':
      return {
        ...state,
        cards: action.cards
      }

    case 'CLEAR_CARDS':
      return {
        ...state,
        cards: []
      }

    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.newCard]
      }

    case 'EDIT_CARD':
      return {
        ...state,
        cards: state.cards.map((card) =>
          card._id === action._id ? { ...card, ...action.changes } : card
        )
      }

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((card) => card._id !== action._id)
      }

    case 'LOGIN_USER':
    case 'REGISTER_USER':
    case 'GET_USER':
      return {
        ...state,
        username: action.username
      }

    case 'LOGOUT_USER':
      return {
        ...state,
        username: null
      }

    case 'SET_TTS_LANGUAGE':
      return {
        ...state,
        ttsLanguage: action.language
      }

    case 'SET_TTS_VOICE':
      return {
        ...state,
        ttsVoice: action.voice
      }

    case 'OPEN_CLOSE_REGISTER_MODAL':
      return {
        ...state,
        registerModalOpen: action.open
      }

    case 'OPEN_CLOSE_ADD_CARD_MODAL':
      return {
        ...state,
        addCardModalOpen: action.open
      }

    case 'OPEN_CLOSE_EDIT_CARD_MODAL':
      return {
        ...state,
        editCardModalOpen: action.open
      }

    case 'SET_EDIT_CARD_ID':
      return {
        ...state,
        editCardId: action.id
      }

    case 'SET_AUTOPLAY_TTS':
      return {
        ...state,
        autoplayTts: action.autoplayTts
      }

    case 'SET_REVERSE_QUIZ':
      return {
        ...state,
        reverseQuiz: action.reverseQuiz
      }

    case 'SET_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.errorMessage
      }

    default:
      return state
  }
}
