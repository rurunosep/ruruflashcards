import { v4 as uuid } from 'uuid'

// TODO API calls in here

export const addCard = (front, back) => {
  return {
    type: 'ADD_CARD',
    newCard: { id: uuid(), front, back, enabled: true }
  }
}

export const editCard = (id, changes) => {
  return {
    type: 'EDIT_CARD',
    id,
    changes
  }
}

export const deleteCard = (id) => {
  return {
    type: 'DELETE_CARD',
    id
  }
}

export const enableAllCards = () => {
  return {
    type: 'ENABLE_ALL_CARDS'
  }
}

export const disableAllCards = () => {
  return {
    type: 'DISABLE_ALL_CARDS'
  }
}
export const swapAllFields = () => {
  return {
    type: 'SWAP_ALL_FIELDS'
  }
}
