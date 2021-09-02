import { useState, useCallback } from "react";

export const useSigner = () => {
  const [signer, setSigner] = useState();
  const [ethcallProvider, setEthcallProvider] = useState();

  const setCurrentSigner = useCallback((currentSigner) => {
    setSigner(currentSigner);
  }, []);

  const setCurrentEthcallProvider = useCallback((currentProvider) => {
    setEthcallProvider(currentProvider);
  }, []);

  return {
    signer,
    setCurrentSigner,
    ethcallProvider,
    setCurrentEthcallProvider,
  };
};
