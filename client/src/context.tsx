import React, { useMemo, useState } from 'react';

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
