import axios from 'axios'

export const loadCards = () => (dispatch) => {
  axios.get('/api/cards').then((res) =>
    dispatch({
      type: 'LOAD_CARDS',
      cards: res.data
    })
  )
}

export const addCard = (front, back) => (dispatch) => {
  axios.post('/api/cards', { front, back }).then((res) =>
    dispatch({
      type: 'ADD_CARD',
      newCard: { _id: res.data, front, back, enabled: true }
    })
  )
}

export const editCard = (_id, changes) => (dispatch) => {
  axios.put(`/api/cards/${_id}`, changes).then((res) =>
    dispatch({
      type: 'EDIT_CARD',
      _id,
      changes
    })
  )
}

export const deleteCard = (_id) => (dispatch) => {
  axios.delete(`/api/cards/${_id}`).then((res) =>
    dispatch({
      type: 'DELETE_CARD',
      _id
    })
  )
}

export const login = (username, password) => (dispatch) => {
  axios.post('api/auth/login', { username, password }).then((res) => {
    dispatch({
      type: 'LOGIN_USER',
      username
    })
    dispatch(loadCards())
  })
}

export const register = (username, password) => (dispatch) => {
  axios.post('api/auth/register', { username, password }).then((res) => {
    dispatch({
      type: 'REGISTER_USER',
      username
    })
  })
}

export const logout = () => (dispatch) => {
  axios.get('api/auth/logout').then((res) => {
    dispatch({
      type: 'LOGOUT_USER'
    })
    dispatch({
      type: 'CLEAR_CARDS'
    })
  })
}

export const getUser = () => (dispatch) => {
  axios.get('api/auth/user').then((res) => {
    dispatch({
      type: 'GET_USER',
      username: res.data ? res.data : null
    })
  })
}
