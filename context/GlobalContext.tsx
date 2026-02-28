"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from "react";

interface GlobalContextType {}

// Create a context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
// Create a provider
export function GlobalProvider({ children }: PropsWithChildren) {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
}

// Create a custom hook to acces the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used inside GlobalProvider");
  }

  return context;
};
