import { useState, useCallback } from "react";

export const useTokens = () => {
  const [avaxToken, setAVAXToken] = useState();
  const [wethToken, setETHToken] = useState();
  const [daiToken, setDAIToken] = useState();
  const [dvixToken, setDVIXToken] = useState();
  const [avixToken, setAvixToken] = useState();

  const [avaxPoolToken, setAVAXPoolToken] = useState(); // dVIX/WAVAX LP Token
  const [wethPoolToken, setWETHPoolToken] = useState(); // dVIX/WETH LP Token
  const [daiPoolToken, setDAIPoolToken] = useState(); // dVIX/DAI LP Token
  const [avixPoolToken, setAVIXPoolToken] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const [avaxTokenRead, setAVAXTokenRead] = useState();
  const [wethTokenRead, setETHTokenRead] = useState();
  const [daiTokenRead, setDAITokenRead] = useState();
  const [dvixTokenRead, setDVIXTokenRead] = useState();
  const [avixTokenRead, setAvixTokenRead] = useState();

  const [avaxPoolTokenRead, setAVAXPoolTokenRead] = useState(); // dVIX/WAVAX LP Token
  const [wethPoolTokenRead, setWETHPoolTokenRead] = useState(); // dVIX/WETH LP Token
  const [daiPoolTokenRead, setDAIPoolTokenRead] = useState(); // dVIX/DAI LP Token
  const [avixPoolTokenRead, setAVIXPoolTokenRead] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const setCurrentAVAXToken = useCallback((currentAVAXToken) => {
    setAVAXToken(currentAVAXToken);
  }, []);
  const setCurrentWETHToken = useCallback((currentWETHToken) => {
    setETHToken(currentWETHToken);
  }, []);
  const setCurrentDAIToken = useCallback((currentDAIToken) => {
    setDAIToken(currentDAIToken);
  }, []);
  const setCurrentDVIXToken = useCallback((currentDVIXToken) => {
    setDVIXToken(currentDVIXToken);
  }, []);
  const setCurrentAvixToken = useCallback((currentAvix) => {
    setAvixToken(currentAvix);
  }, []);

  const setCurrentAVAXPoolToken = useCallback((currentAVAXPoolToken) => {
    setAVAXPoolToken(currentAVAXPoolToken);
  }, []);
  const setCurrentWETHPoolToken = useCallback((currentWETHPoolToken) => {
    setWETHPoolToken(currentWETHPoolToken);
  }, []);
  const setCurrentDAIPoolToken = useCallback((currentDAIPoolToken) => {
    setDAIPoolToken(currentDAIPoolToken);
  }, []);
  const setCurrentAVIXPoolToken = useCallback((currentAVIXPoolToken) => {
    setAVIXPoolToken(currentAVIXPoolToken);
  }, []);

  const setCurrentAVAXTokenRead = useCallback((currentAVAXTokenRead) => {
    setAVAXTokenRead(currentAVAXTokenRead);
  }, []);
  const setCurrentWETHTokenRead = useCallback((currentWETHTokenRead) => {
    setETHTokenRead(currentWETHTokenRead);
  }, []);
  const setCurrentDAITokenRead = useCallback((currentDAITokenRead) => {
    setDAITokenRead(currentDAITokenRead);
  }, []);
  const setCurrentDVIXTokenRead = useCallback((currentDVIXTokenRead) => {
    setDVIXTokenRead(currentDVIXTokenRead);
  }, []);
  const setCurrentAvixTokenRead = useCallback((currentAvixRead) => {
    setAvixTokenRead(currentAvixRead);
  }, []);

  const setCurrentAVAXPoolTokenRead = useCallback(
    (currentAVAXPoolTokenRead) => {
      setAVAXPoolTokenRead(currentAVAXPoolTokenRead);
    },
    []
  );
  const setCurrentWETHPoolTokenRead = useCallback(
    (currentWETHPoolTokenRead) => {
      setWETHPoolTokenRead(currentWETHPoolTokenRead);
    },
    []
  );
  const setCurrentDAIPoolTokenRead = useCallback((currentDAIPoolTokenRead) => {
    setDAIPoolTokenRead(currentDAIPoolTokenRead);
  }, []);
  const setCurrentAVIXPoolTokenRead = useCallback(
    (currentAVIXPoolTokenRead) => {
      setAVIXPoolTokenRead(currentAVIXPoolTokenRead);
    },
    []
  );

  return {
    avaxToken,
    setCurrentAVAXToken,
    wethToken,
    setCurrentWETHToken,
    daiToken,
    setCurrentDAIToken,
    dvixToken,
    setCurrentDVIXToken,
    avixToken,
    setCurrentAvixToken,
    avaxPoolToken,
    setCurrentAVAXPoolToken,
    wethPoolToken,
    setCurrentWETHPoolToken,
    daiPoolToken,
    setCurrentDAIPoolToken,
    avixPoolToken,
    setCurrentAVIXPoolToken,
    avaxTokenRead,
    setCurrentAVAXTokenRead,
    wethTokenRead,
    setCurrentWETHTokenRead,
    daiTokenRead,
    setCurrentDAITokenRead,
    dvixTokenRead,
    avixTokenRead,
    setCurrentAvixTokenRead,
    setCurrentDVIXTokenRead,
    wethPoolTokenRead,
    setCurrentWETHPoolTokenRead,
    daiPoolTokenRead,
    setCurrentDAIPoolTokenRead,
    avixPoolTokenRead,
    setCurrentAVIXPoolTokenRead,
    avaxPoolTokenRead,
    setCurrentAVAXPoolTokenRead,
  };
};
