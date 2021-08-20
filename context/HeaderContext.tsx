import React, { useState, useContext, SetStateAction, Dispatch } from "react";

export interface HeaderOptionsI {
  title: string;
  hasBackButton: boolean;
}

interface HeaderContextI extends HeaderOptionsI {
  setOptions?: (options: HeaderOptionsI) => void;
}

const HeaderContext = React.createContext<HeaderContextI>({
  title: "",
  hasBackButton: false,
});

export function HeaderProvider({ children }) {
  const [title, setTitle] = useState<string>();
  const [hasBackButton, setHasBackButton] = useState<boolean>();

  function setOptions(options: HeaderOptionsI) {
    setTitle(options.title);
    setHasBackButton(options.hasBackButton);
  }

  return (
    <HeaderContext.Provider
      value={{
        title,
        hasBackButton,
        setOptions,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext);
}
