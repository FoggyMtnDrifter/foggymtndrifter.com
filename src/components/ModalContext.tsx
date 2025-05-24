import React, { createContext, useContext, useState, useEffect } from "react";

type ModalContextType = {
  isTipModalOpen: boolean;
  isThankYouModalOpen: boolean;
  openTipModal: () => void;
  closeTipModal: () => void;
  openThankYouModal: () => void;
  closeThankYouModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  // Check for hash on initial load and window popstate events
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;

      if (hash === "#tipme") {
        setIsTipModalOpen(true);
        setIsThankYouModalOpen(false);
      } else if (
        hash === "#thank-you-subscription" ||
        hash === "#thank-you-tip"
      ) {
        setIsTipModalOpen(false);
        setIsThankYouModalOpen(true);
      } else {
        setIsTipModalOpen(false);
        setIsThankYouModalOpen(false);
      }
    };

    // Check hash on mount
    checkHash();

    // Add popstate listener to handle browser back button
    window.addEventListener("popstate", checkHash);

    return () => {
      window.removeEventListener("popstate", checkHash);
    };
  }, []);

  const openTipModal = () => {
    setTimeout(() => {
      setIsTipModalOpen(true);
      setIsThankYouModalOpen(false);
      window.history.pushState({}, "", `${window.location.pathname}#tipme`);
    }, 100);
  };

  const closeTipModal = () => {
    setIsTipModalOpen(false);
    if (window.location.hash === "#tipme") {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  const openThankYouModal = () => {
    setTimeout(() => {
      setIsThankYouModalOpen(true);
      setIsTipModalOpen(false);
      window.history.pushState({}, "", `${window.location.pathname}#thank-you`);
    }, 100);
  };

  const closeThankYouModal = () => {
    setIsThankYouModalOpen(false);
    const hash = window.location.hash;
    if (hash === "#thank-you-subscription" || hash === "#thank-you-tip") {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        isTipModalOpen,
        isThankYouModalOpen,
        openTipModal,
        closeTipModal,
        openThankYouModal,
        closeThankYouModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
