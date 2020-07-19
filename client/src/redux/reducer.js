import { v4 as uuid } from 'uuid'

// TODO pull cards from back end
let initialCards = JSON.parse(localStorage.getItem('cards'))
if (!initialCards) {
  initialCards = [
    { front: '개', back: 'Dog', id: uuid(), enabled: true },
    { front: '고양이', back: 'Cat', id: uuid(), enabled: true },
    { front: '물고기', back: 'Fish', id: uuid(), enabled: true }
  ]
}

const initialState = {
  cards: initialCards
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.newCard]
      }

    case 'EDIT_CARD':
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.id ? { ...card, ...action.changes } : card
        )
      }

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.id)
      }

    case 'ENABLE_ALL_CARDS':
      return {
        ...state,
        cards: state.cards.map((card) => ({ ...card, enabled: true }))
      }

    case 'DISABLE_ALL_CARDS':
      return {
        ...state,
        cards: state.cards.map((card) => ({ ...card, enabled: false }))
      }

    case 'SWAP_ALL_FIELDS':
      return {
        ...state,
        cards: state.cards.map((card) => ({ ...card, front: card.back, back: card.front }))
      }

    default:
      return state
  }
}
