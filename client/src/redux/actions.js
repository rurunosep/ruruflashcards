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

// TODO make an api endpoint
export const enableAllCards = () => (dispatch) => {
  return {
    type: 'ENABLE_ALL_CARDS'
  }
}

// TODO make an api endpoint
export const disableAllCards = () => {
  return {
    type: 'DISABLE_ALL_CARDS'
  }
}

// TODO make an api endpoint
export const swapAllFields = () => {
  return {
    type: 'SWAP_ALL_FIELDS'
  }
}
