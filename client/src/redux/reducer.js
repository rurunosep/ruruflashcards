const initialState = {
  cards: [],
  username: null
}

export default function reducer(state = initialState, action) {
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

    default:
      return state
  }
}
