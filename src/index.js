import React from 'react'
import ReactDOM from 'react-dom'

function handleFieldChange(component, event) {
  component.setState({
    [event.target.name]: event.target.value,
  })
}

class EditableCardListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      front: this.props.card.front,
      back: this.props.card.back
    }
  }

  handleFieldChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSave = () => {
    this.props.saveCard({ front: this.state.front, back: this.state.back })
  }

  render() {
    return (
      <tr>
        <td><input
          type='text'
          name='front'
          value={this.state.front}
          onChange={(e) => handleFieldChange(this, e)} /></td>
        <td><input
          type='text'
          name='back'
          value={this.state.back}
          onChange={(e) => handleFieldChange(this, e)} /></td>
        <td><button onClick={this.handleSave}>Save</button></td>
        <td><button onClick={this.props.deleteCard}>Delete</button></td>
      </tr>
    )
  }
}

function UneditableCardListRow(props) {
  return (
    <tr>
      <td>{props.card.front}</td>
      <td>{props.card.back}</td>
      <td><button onClick={props.setEditable}>Edit</button></td>
    </tr>
  )
}

class CardsListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editable: false,
    }
  }

  setEditable = () => {
    this.setState({
      editable: true,
    })
  }

  saveCard = (newCard) => {
    this.props.editCard(newCard)
    this.setState({
      editable: false,
    })
  }

  deleteCard = () => {
    this.props.deleteCard()
    this.setState({
      editable: false,
    })
  }

  render() {
    if (this.state.editable) {
      return (
        <EditableCardListRow
          card={this.props.card}
          saveCard={this.saveCard}
          deleteCard={this.deleteCard} />
      )
    } else {
      return (
        <UneditableCardListRow
          card={this.props.card}
          setEditable={this.setEditable} />
      )
    }
  }
}

function CardsList(props) {
  const rows = []
  props.cards.forEach((card, index) => {
    rows.push(
      <CardsListRow
        card={card}
        deleteCard={() => props.deleteCard(index)}
        editCard={(newCard) => props.editCard(index, newCard)}
        key={index} />
    )
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Front</th>
          <th>Back</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )

}

class AddCardForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      front: '',
      back: '',
    }
  }

  handleFieldChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.addCard({
      front: this.state.front,
      back: this.state.back,
    })
    this.setState({
      front: '',
      back: '',
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='front'
          placeholder='Front'
          value={this.state.front}
          onChange={(e) => handleFieldChange(this, e)} />
        <input
          type='text'
          name='back'
          placeholder='Back'
          value={this.state.back}
          onChange={(e) => handleFieldChange(this, e)} />
        <input type='submit' value='Add Card' />
      </form >
    )
  }
}

function ShowHideListButton(props) {
  return (
    <button onClick={() => props.onClick()}>
      {props.listVisible ? 'Hide List' : 'Show List'}
    </button>
  )
}

// TODO: rename
class CardDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flipped: false,
    }
  }

  flipCard = () => {
    this.setState({
      flipped: !this.state.flipped,
    })
  }

  showNextCard = () => {
    this.props.displayNextCard()
    this.setState({
      flipped: false,
    })
  }

  render() {
    return (
      <div>
        <h1>{this.state.flipped ? this.props.card.back : this.props.card.front}</h1>
        <button onClick={this.flipCard}>Flip Card</button>
        <button onClick={this.showNextCard}>Next Card</button>
        <hr></hr>
      </div>
    )
  }
}

const initialCards = [
  { front: 'Dog', back: 'Bark' },
  { front: 'Cat', back: 'Meow' },
  { front: 'Fish', back: 'Blub' },
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: initialCards,
      listVisible: true,
      currentCardIndex: 0,
    }
  }

  deleteCard = (indexToDelete) => {
    this.setState({
      cards: this.state.cards.filter((card, index) => {
        return index !== indexToDelete
      })
    })
  }

  addCard = (card) => {
    this.setState({
      cards: [...this.state.cards, card],
    })
  }

  editCard = (indexToEdit, newCard) => {
    this.setState({
      cards: this.state.cards.map((card, index) => {
        return index === indexToEdit ? newCard : card
      })
    })
  }

  toggleListVisible = () => {
    this.setState({
      listVisible: !this.state.listVisible,
    })
  }

  showNextCard = () => {
    let nextCardIndex = this.state.currentCardIndex + 1
    if (nextCardIndex >= this.state.cards.length) {
      nextCardIndex = 0
    }
    this.setState({
      currentCardIndex: nextCardIndex,
    })
  }

  render() {
    const listAndForm =
      <div>
        <AddCardForm
          addCard={this.addCard} />
        <CardsList
          cards={this.state.cards}
          deleteCard={this.deleteCard}
          editCard={this.editCard} />
      </div>

    // TODO: do CSS shit to make the card and list side by side
    return (
      <div>
        <CardDisplay
          card={this.state.cards[this.state.currentCardIndex]}
          displayNextCard={this.showNextCard} />
        <ShowHideListButton
          listVisible={this.state.listVisible}
          onClick={this.toggleListVisible} />
        {this.state.listVisible ? listAndForm : ''}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))