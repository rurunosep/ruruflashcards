import axios from 'axios'

export const loadCards = () => (dispatch) => {
  axios
    .get('/api/cards')
    .then((res) =>
      dispatch({
        type: 'LOAD_CARDS',
        cards: res.data
      })
    )
    .catch((err) => {}) // TODO (and all the others)
}

export const addCard = (front, back) => (dispatch) => {
  axios
    .post('/api/cards', { front, back })
    .then((res) =>
      dispatch({
        type: 'ADD_CARD',
        newCard: { _id: res.data, front, back }
      })
    )
    .catch((err) => {})
}

export const editCard = (_id, changes) => (dispatch) => {
  axios
    .put(`/api/cards/${_id}`, changes)
    .then((res) =>
      dispatch({
        type: 'EDIT_CARD',
        _id,
        changes
      })
    )
    .catch((err) => {})
}

export const deleteCard = (_id) => (dispatch) => {
  axios
    .delete(`/api/cards/${_id}`)
    .then((res) =>
      dispatch({
        type: 'DELETE_CARD',
        _id
      })
    )
    .catch((err) => {})
}

export const login = (username, password) => (dispatch) => {
  axios
    .post('api/auth/login', { username, password })
    .then((res) => {
      dispatch({
        type: 'LOGIN_USER',
        username
      })
      dispatch(loadCards())
    })
    .catch((err) => {
      if (err.response) {
        dispatch(setErrorMessage(err.response.data))
      }
    })
}

export const register = (username, password) => (dispatch) => {
  axios
    .post('api/auth/register', { username, password })
    .then((res) => {
      dispatch({
        type: 'REGISTER_USER',
        username
      })
      dispatch(loadCards())
    })
    .catch((err) => {
      if (err.response) {
        dispatch(setErrorMessage(err.response.data))
      }
    })
}

export const logout = () => (dispatch) => {
  axios
    .get('api/auth/logout')
    .then((res) => {
      dispatch({
        type: 'LOGOUT_USER'
      })
      dispatch({
        type: 'CLEAR_CARDS'
      })
    })
    .catch((err) => {})
}

export const getUser = () => (dispatch) => {
  axios
    .get('api/auth/user')
    .then((res) => {
      dispatch({
        type: 'GET_USER',
        username: res.data ? res.data : null
      })
    })
    .catch((err) => {})
}

export const setTtsLanguage = (language) => {
  return {
    type: 'SET_TTS_LANGUAGE',
    language
  }
}

export const setTtsVoice = (voice) => {
  return {
    type: 'SET_TTS_VOICE',
    voice
  }
}

export const setRegisterModalOpen = (open) => {
  return {
    type: 'OPEN_CLOSE_REGISTER_MODAL',
    open
  }
}

export const setAddCardModalOpen = (open) => {
  return {
    type: 'OPEN_CLOSE_ADD_CARD_MODAL',
    open
  }
}

export const setEditCardModalOpen = (open) => {
  return {
    type: 'OPEN_CLOSE_EDIT_CARD_MODAL',
    open
  }
}

export const setEditCardId = (id) => {
  return {
    type: 'SET_EDIT_CARD_ID',
    id
  }
}

export const setAutoplayTts = (autoplayTts) => {
  return {
    type: 'SET_AUTOPLAY_TTS',
    autoplayTts
  }
}

export const setReverseQuiz = (reverseQuiz) => {
  return {
    type: 'SET_REVERSE_QUIZ',
    reverseQuiz
  }
}

export const setErrorMessage = (errorMessage) => {
  return {
    type: 'SET_ERROR_MESSAGE',
    errorMessage
  }
}
