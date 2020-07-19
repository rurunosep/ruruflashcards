const initialState = {
  cards: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_CARDS':
      return {
        ...state,
        cards: action.cards
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
