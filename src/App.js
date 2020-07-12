import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import CardsList from './CardsList.js'
import Quiz from './Quiz.js'

function App({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [currentCardIndex, setCurrentCardIndex] = useState()
  const [shouldShowNewCard, setShouldShowNewCard] = useState(true)

  useEffect(
    function saveCardsToLocalStorage() {
      localStorage.setItem('cards', JSON.stringify(cards))
    },
    [cards]
  )

  // TODO: cleanup
  useEffect(
    function showRandomCard() {
      if (shouldShowNewCard) {
        let newCardIndex = null
        if (cards.filter((card) => card.enabled).length > 0) {
          do {
            newCardIndex = Math.floor(Math.random() * cards.length)
          } while (!cards[newCardIndex].enabled)
        }
        setCurrentCardIndex(newCardIndex)
        setShouldShowNewCard(false)
      }
    },
    [shouldShowNewCard, cards]
  )

  return (
    <div className='app'>
      <Quiz
        card={cards[currentCardIndex]}
        showNewCard={() => setShouldShowNewCard(true)}
        editCard={(changes) =>
          setCards(
            cards.map((card, i) => (currentCardIndex === i ? { ...card, ...changes } : card))
          )
        }
      />

      <CardsList
        cards={cards}
        addCard={(fields) => setCards([...cards, { ...fields, id: uuid(), enabled: true }])}
        editCard={(index, changes) => {
          setCards(cards.map((card, i) => (index === i ? { ...card, ...changes } : card)))
        }}
        deleteCard={(index) => {
          setCards(cards.filter((card, i) => index !== i))
        }}
        setAllCardsEnabled={(enabled) => {
          setCards(cards.map((card) => ({ ...card, enabled: enabled })))
        }}
        swapAllFields={() => {
          setCards(
            cards.map((card) => ({
              ...card,
              front: card.back,
              back: card.front,
            }))
          )
        }}
      />
    </div>
  )
}

export default App
