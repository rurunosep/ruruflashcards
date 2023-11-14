import { useState, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext, LoadingContext } from '../context';

interface CardsListProps {
  cards: Card[];
}

export default function CardsList({ cards }: CardsListProps) {
  const { setAddCardModalOpen, setEditCardModalOpen, setCardToEdit } = useContext(ModalContext);
  const {
    addCard: { loading: addCardLoading },
    editDeleteCard: { cardIds: loadingCardIds },
  } = useContext(LoadingContext);
  const [listVisible, setListVisible] = useState(true);

  return (
    <div className="card card-no-hover" style={{ height: '24.5rem' }}>
      <div className="collapsible" style={{ borderTop: 'none' }}>
        {/* id MUST start with "collapsible" */}
        <input
          id="collapsible-list"
          type="checkbox"
          name="collapsible"
          checked={listVisible}
          onChange={(e) => {
            setListVisible(e.target.checked);
          }}
        />
        <div className="row flex-edges margin-none" style={{ width: '100%' }}>
          <label
            htmlFor="collapsible-list"
            className="paper-btn btn-small"
            popover-top="Hide/Show List"
            style={{
              border: '2px solid #41403e',
              margin: '0.5rem',
            }}
          >
            {listVisible ? (
              <i className="flaticon-up-arrow-triangle-hand-drawn-outline" />
            ) : (
              <i className="flaticon-down-arrow-hand-drawn-triangle" />
            )}
          </label>
          <div>
            <ClipLoader loading={addCardLoading} size="1em" />
            <button
              type="button"
              className="btn-small margin-none"
              popover-top="Add Card"
              style={{ margin: '0.5rem' }}
              onClick={() => setAddCardModalOpen(true)}
            >
              <i className="flaticon-plus-hand-drawn-sign" />
            </button>
          </div>
        </div>
        <div className="collapsible-body" style={{ padding: '0' }}>
          <div style={{ height: '21rem', overflowY: 'scroll', borderTop: '2px solid #e6e7e9' }}>
            {cards.map((card) => (
              <div
                key={card._id}
                className="row flex-middle flex-edges padding-bottom-small padding-top-small margin-none"
                style={{ width: '100%', borderBottom: '1px dashed' }}
              >
                <div className="col-5 padding-left" style={{ overflow: 'hidden' }}>
                  {card.front}
                </div>
                <div className="col-5" style={{ overflow: 'hidden' }}>
                  {card.back}
                </div>
                <div
                  className="col-2 padding-right"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {loadingCardIds.includes(card._id) ? (
                    <ClipLoader loading size="1.5em" />
                  ) : (
                    <button
                      type="button"
                      className="btn-small margin-none"
                      popover-top="Edit Card"
                      onClick={() => {
                        setCardToEdit(card);
                        setEditCardModalOpen(true);
                      }}
                    >
                      <i className="flaticon-pencil-hand-drawn-tool-outline" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
