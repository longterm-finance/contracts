import { useState, useCallback } from "react";

export const useTokens = () => {
  const [wavaxToken, setWAVAXToken] = useState();
  const [wethToken, setETHToken] = useState();
  const [daiToken, setDAIToken] = useState();
  const [dvixToken, setDVIXToken] = useState();
  const [avixToken, setAvixToken] = useState();

  const [wavaxPoolToken, setWAVAXPoolToken] = useState(); // dVIX/WAVAX LP Token
  const [wethPoolToken, setWETHPoolToken] = useState(); // dVIX/WETH LP Token
  const [daiPoolToken, setDAIPoolToken] = useState(); // dVIX/DAI LP Token
  const [avixPoolToken, setAVIXPoolToken] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const [wavaxTokenRead, setWAVAXTokenRead] = useState();
  const [wethTokenRead, setETHTokenRead] = useState();
  const [daiTokenRead, setDAITokenRead] = useState();
  const [dvixTokenRead, setDVIXTokenRead] = useState();
  const [avixTokenRead, setAvixTokenRead] = useState();

  const [wavaxPoolTokenRead, setWAVAXPoolTokenRead] = useState(); // dVIX/WAVAX LP Token
  const [wethPoolTokenRead, setWETHPoolTokenRead] = useState(); // dVIX/WETH LP Token
  const [daiPoolTokenRead, setDAIPoolTokenRead] = useState(); // dVIX/DAI LP Token
  const [avixPoolTokenRead, setAVIXPoolTokenRead] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const setCurrentWAVAXToken = useCallback((currentWAVAXToken) => {
    setWAVAXToken(currentWAVAXToken);
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

  const setCurrentWAVAXPoolToken = useCallback((currentWAVAXPoolToken) => {
    setWAVAXPoolToken(currentWAVAXPoolToken);
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

  const setCurrentWAVAXTokenRead = useCallback((currentWAVAXTokenRead) => {
    setWAVAXTokenRead(currentWAVAXTokenRead);
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

  const setCurrentWAVAXPoolTokenRead = useCallback(
    (currentWAVAXPoolTokenRead) => {
      setWAVAXPoolTokenRead(currentWAVAXPoolTokenRead);
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
    wavaxToken,
    setCurrentWAVAXToken,
    wethToken,
    setCurrentWETHToken,
    daiToken,
    setCurrentDAIToken,
    dvixToken,
    setCurrentDVIXToken,
    avixToken,
    setCurrentAvixToken,
    wavaxPoolToken,
    setCurrentWAVAXPoolToken,
    wethPoolToken,
    setCurrentWETHPoolToken,
    daiPoolToken,
    setCurrentDAIPoolToken,
    avixPoolToken,
    setCurrentAVIXPoolToken,
    wavaxTokenRead,
    setCurrentWAVAXTokenRead,
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
    wavaxPoolTokenRead,
    setCurrentWAVAXPoolTokenRead,
  };
};
