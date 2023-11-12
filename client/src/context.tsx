import React, { useMemo, useState } from 'react';

// ------------------------------------------------------------------
// Modal Context
// ------------------------------------------------------------------

interface ModalContextType {
  addCardModalOpen: boolean;
  setAddCardModalOpen: (open: boolean) => void;
  editCardModalOpen: boolean;
  setEditCardModalOpen: (open: boolean) => void;
  cardToEdit: Card | null;
  setCardToEdit: (card: Card | null) => void;
  registerModalOpen: boolean;
  setRegisterModalOpen: (open: boolean) => void;
}

export const ModalContext = React.createContext({} as ModalContextType);

export function ModalContextProvider({ children }: { children: React.ReactNode }) {
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const value = useMemo(
    () => ({
      addCardModalOpen,
      setAddCardModalOpen,
      editCardModalOpen,
      setEditCardModalOpen,
      cardToEdit,
      setCardToEdit,
      registerModalOpen,
      setRegisterModalOpen,
    }),
    [addCardModalOpen, editCardModalOpen, cardToEdit, registerModalOpen],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

// ------------------------------------------------------------------
// Loading Context
// ------------------------------------------------------------------

interface LoadingContextType {
  login: {
    loading: boolean;
    setLoading: (loading: boolean) => void;
  };
  cards: {
    loading: boolean;
    setLoading: (loading: boolean) => void;
  };
  addCard: {
    loading: boolean;
    setLoading: (loading: boolean) => void;
  };
  editDeleteCard: {
    // A list of the string _id's of cards waiting on an edit or delete API response
    cardIds: string[];
    setCardIds: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

export const LoadingContext = React.createContext({} as LoadingContextType);

export function LoadingContextProvider({ children }: { children: React.ReactNode }) {
  const login = useState(false);
  const cards = useState(false);
  const addCard = useState(false);
  const editDeleteCard = useState([] as string[]);

  const value = useMemo(
    () => ({
      login: {
        loading: login[0],
        setLoading: login[1],
      },
      cards: {
        loading: cards[0],
        setLoading: cards[1],
      },
      addCard: {
        loading: addCard[0],
        setLoading: addCard[1],
      },
      editDeleteCard: {
        cardIds: editDeleteCard[0],
        setCardIds: editDeleteCard[1],
      },
    }),
    [login[0], cards[0], addCard[0], editDeleteCard[0]],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}
