import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setAddCardModalOpen, setEditCardModalOpen, setEditCardId } from '../redux/actions'

function CardsList({ cards, setAddCardModalOpen, setEditCardModalOpen, setEditCardId }) {
  const [listVisible, setListVisible] = useState(true)

  return (
    <div className='card card-no-hover' style={{ height: '22.5rem' }}>
      <div className='collapsible' style={{ borderTop: 'none' }}>
        {/* id MUST start with "collapsible" */}
        <input
          id='collapsible-list'
          type='checkbox'
          name='collapsible'
          checked={listVisible}
          onChange={(e) => {
            setListVisible(e.target.checked)
          }}
        />
        <div className='row flex-edges margin-none' style={{ width: '100%' }}>
          <label
            htmlFor='collapsible-list'
            className='paper-btn btn-small'
            popover-top='Hide/Show List'
            style={{
              border: '2px solid #41403e',
              margin: '0.5rem'
            }}
          >
            {listVisible ? (
              <i className='flaticon-up-arrow-triangle-hand-drawn-outline'></i>
            ) : (
              <i className='flaticon-down-arrow-hand-drawn-triangle'></i>
            )}
          </label>
          <button
            className='btn-small margin-none'
            popover-top='Add Card'
            style={{ margin: '0.5rem' }}
            onClick={() => setAddCardModalOpen(true)}
          >
            <i className='flaticon-plus-hand-drawn-sign'></i>
          </button>
        </div>
        <div className='collapsible-body' style={{ padding: '0' }}>
          <div style={{ height: '19rem', overflowY: 'scroll', borderTop: '2px solid #e6e7e9' }}>
            {cards.map((card) => (
              <div
                key={card._id}
                className='row flex-middle flex-edges padding-bottom-small padding-top-small margin-none'
                style={{ width: '100%', borderBottom: '1px dashed' }}
              >
                <div className='col-5 padding-left' style={{ overflow: 'hidden' }}>
                  {card.front}
                </div>
                <div className='col-5' style={{ overflow: 'hidden' }}>
                  {card.back}
                </div>
                <div
                  className='col-2 padding-right'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <button
                    className='btn-small margin-none'
                    popover-top='Edit Card'
                    onClick={() => {
                      setEditCardId(card._id)
                      setEditCardModalOpen(true)
                    }}
                  >
                    <i className='flaticon-pencil-hand-drawn-tool-outline'></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const stateToProps = (state) => ({
  cards: state.cards
})

export default connect(stateToProps, { setAddCardModalOpen, setEditCardModalOpen, setEditCardId })(
  CardsList
)
