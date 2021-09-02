import { useState, useCallback } from "react";

export const useTokens = () => {
  const [avaxToken, setAVAXToken] = useState();
  const [usdtToken, setUSDTToken] = useState();
  const [wethToken, setETHToken] = useState();
  const [daiToken, setDAIToken] = useState();
  const [wbtcToken, setWBTCToken] = useState();
  const [dvixToken, setDVIXToken] = useState();
  const [avixToken, setAvixToken] = useState();

  const [avaxPoolToken, setAVAXPoolToken] = useState(); // dVIX/WAVAX LP Token
  const [usdtPoolToken, setUSDTPoolToken] = useState(); // dVIX/USDT LP Token
  const [wethPoolToken, setWETHPoolToken] = useState(); // dVIX/WETH LP Token
  const [daiPoolToken, setDAIPoolToken] = useState(); // dVIX/DAI LP Token
  const [wbtcPoolToken, setWBTCPoolToken] = useState(); // dVIX/WBTC LP Token
  const [avixPoolToken, setAVIXPoolToken] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const [avaxTokenRead, setAVAXTokenRead] = useState();
  const [usdtTokenRead, setUSDTTokenRead] = useState();
  const [wethTokenRead, setETHTokenRead] = useState();
  const [daiTokenRead, setDAITokenRead] = useState();
  const [wbtcTokenRead, setWBTCTokenRead] = useState();
  const [dvixTokenRead, setDVIXTokenRead] = useState();
  const [avixTokenRead, setAvixTokenRead] = useState();

  const [avaxPoolTokenRead, setAVAXPoolTokenRead] = useState(); // dVIX/WAVAX LP Token
  const [usdtPoolTokenRead, setUSDTPoolTokenRead] = useState(); // dVIX/USDT LP Token
  const [wethPoolTokenRead, setWETHPoolTokenRead] = useState(); // dVIX/WETH LP Token
  const [daiPoolTokenRead, setDAIPoolTokenRead] = useState(); // dVIX/DAI LP Token
  const [wbtcPoolTokenRead, setWBTCPoolTokenRead] = useState(); // dVIX/WBTC LP Token
  const [avixPoolTokenRead, setAVIXPoolTokenRead] = useState(); // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  const setCurrentAVAXToken = useCallback((currentAVAXToken) => {
    setAVAXToken(currentAVAXToken);
  }, []);
  const setCurrentUSDTToken = useCallback((currentUSDTToken) => {
    setUSDTToken(currentUSDTToken);
  }, []);
  const setCurrentWETHToken = useCallback((currentWETHToken) => {
    setETHToken(currentWETHToken);
  }, []);
  const setCurrentDAIToken = useCallback((currentDAIToken) => {
    setDAIToken(currentDAIToken);
  }, []);
  const setCurrentWBTCToken = useCallback((currentWBTCToken) => {
    setWBTCToken(currentWBTCToken);
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
  const setCurrentUSDTPoolToken = useCallback((currentUSDTPoolToken) => {
    setUSDTPoolToken(currentUSDTPoolToken);
  }, []);
  const setCurrentWETHPoolToken = useCallback((currentWETHPoolToken) => {
    setWETHPoolToken(currentWETHPoolToken);
  }, []);
  const setCurrentDAIPoolToken = useCallback((currentDAIPoolToken) => {
    setDAIPoolToken(currentDAIPoolToken);
  }, []);
  const setCurrentWBTCPoolToken = useCallback((currentWBTCPoolToken) => {
    setWBTCPoolToken(currentWBTCPoolToken);
  }, []);
  const setCurrentAVIXPoolToken = useCallback((currentAVIXPoolToken) => {
    setAVIXPoolToken(currentAVIXPoolToken);
  }, []);

  const setCurrentAVAXTokenRead = useCallback((currentAVAXTokenRead) => {
    setAVAXTokenRead(currentAVAXTokenRead);
  }, []);
  const setCurrentUSDTTokenRead = useCallback((currentUSDTTokenRead) => {
    setUSDTTokenRead(currentUSDTTokenRead);
  }, []);
  const setCurrentWETHTokenRead = useCallback((currentWETHTokenRead) => {
    setETHTokenRead(currentWETHTokenRead);
  }, []);
  const setCurrentDAITokenRead = useCallback((currentDAITokenRead) => {
    setDAITokenRead(currentDAITokenRead);
  }, []);
  const setCurrentWBTCTokenRead = useCallback((currentWBTCTokenRead) => {
    setWBTCTokenRead(currentWBTCTokenRead);
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
  const setCurrentUSDTPoolTokenRead = useCallback(
    (currentUSDTPoolTokenRead) => {
      setUSDTPoolTokenRead(currentUSDTPoolTokenRead);
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
  const setCurrentWBTCPoolTokenRead = useCallback(
    (currentWBTCPoolTokenRead) => {
      setWBTCPoolTokenRead(currentWBTCPoolTokenRead);
    },
    []
  );
  const setCurrentAVIXPoolTokenRead = useCallback(
    (currentAVIXPoolTokenRead) => {
      setAVIXPoolTokenRead(currentAVIXPoolTokenRead);
    },
    []
  );

  return {
    avaxToken,
    setCurrentAVAXToken,
    usdtToken,
    setCurrentUSDTToken,
    wethToken,
    setCurrentWETHToken,
    daiToken,
    setCurrentDAIToken,
    wbtcToken,
    setCurrentWBTCToken,
    dvixToken,
    setCurrentDVIXToken,
    avixToken,
    setCurrentAvixToken,
    avaxPoolToken,
    setCurrentAVAXPoolToken,
    usdtPoolToken,
    setCurrentUSDTPoolToken,
    wethPoolToken,
    setCurrentWETHPoolToken,
    daiPoolToken,
    setCurrentDAIPoolToken,
    wbtcPoolToken,
    setCurrentWBTCPoolToken,
    avixPoolToken,
    setCurrentAVIXPoolToken,
    avaxTokenRead,
    setCurrentAVAXTokenRead,
    usdtTokenRead,
    setCurrentUSDTTokenRead,
    wethTokenRead,
    setCurrentWETHTokenRead,
    daiTokenRead,
    setCurrentDAITokenRead,
    wbtcTokenRead,
    setCurrentWBTCTokenRead,
    dvixTokenRead,
    avixTokenRead,
    setCurrentAvixTokenRead,
    setCurrentDVIXTokenRead,
    wethPoolTokenRead,
    setCurrentWETHPoolTokenRead,
    daiPoolTokenRead,
    setCurrentDAIPoolTokenRead,
    wbtcPoolTokenRead,
    setCurrentWBTCPoolTokenRead,
    avixPoolTokenRead,
    setCurrentAVIXPoolTokenRead,
    avaxPoolTokenRead,
    setCurrentAVAXPoolTokenRead,
    usdtPoolTokenRead,
    setCurrentUSDTPoolTokenRead,
  };
};
