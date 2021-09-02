import React from "react";

export const SIGNER_DEFAULT_VALUE = {
  setCurrentSigner: () => {},
  setCurrentEthcallProvider: () => {},
};

const signerContext = React.createContext(SIGNER_DEFAULT_VALUE);

export default signerContext;
