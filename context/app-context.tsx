"use client";

import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, IColumn, TypedColumn } from "@/types";
import React, { createContext, useEffect, useState } from "react";

type AppContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  isLogged: boolean;
  setIsLoged: (v: boolean) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  error: string;
  setError: (v: string) => void;
  searchString: string;
  setSearchString: (v: string) => void;
  modalType: string;
  setModalType: (v: string) => void;
  getBoard: (board: Board) => Board;
  board:Board;
  setBoard: (v:Board)=>Board;
  showAddTaskModal: boolean;
  setShowAddTaskModal: (v: boolean) => void;
  logOut:()=>void
};

export const AppContext = createContext({} as AppContextType);

type Props = {
  children: React.ReactNode;
};

const initialBoard = {
  columns: new Map<TypedColumn, IColumn>(),
};

export const AppContextProvider = ({ children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLoged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchString, setSearchString] = useState("");
  const [modalType, setModalType] = useState("Sign in");
  const [board, setBoard] = useState(initialBoard);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    //check if storarage have token
    if (localStorage.getItem("access_token")) {
      setIsLoged(true);
    }
  }, []);

  useEffect(() => {
    getBoard();
  }, []);

  const logOut = async () => {
    await localStorage.clear();
    await setIsLoged(false);
    getBoard()
  };

  const getBoard = async () => {
    const GroupedBoard = await getTodosGroupedByColumn();
    await setBoard(GroupedBoard);
  };

  const value = {
    setIsModalOpen,
    isModalOpen,
    isLogged,
    logOut,
    setIsLoged,
    isLoading,
    setIsLoading,
    error,
    setError,
    searchString,
    setSearchString,
    modalType,
    setModalType,
    getBoard,
    board,
    setBoard,
    showAddTaskModal,
    setShowAddTaskModal,
  } as unknown as AppContextType;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
