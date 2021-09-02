import { ethers } from "ethers";
import React from "react";
import { toast } from "react-toastify";
import toasty from "../assets/images/toasty.png";

export const makeShortAddress = (address) => {
  const shortAddress = `${address.substr(0, 6).toString()}...${address
    .substr(address.length - 4, address.length)
    .toString()}`;
  return shortAddress;
};

export const isValidAddress = async (address) => {
  try {
    const currentAddress = ethers.utils.getAddress(address);
    return currentAddress;
  } catch (error) {
    console.error(error);
    return null;
    // try {
    //   // const tempProvider = ethers.getDefaultProvider("mainnet", {
    //   //   infura: process.env.REACT_APP_INFURA_ID,
    //   //   alchemy: process.env.REACT_APP_ALCHEMY_KEY,
    //   // });
    //   // const currentAddress = await tempProvider.resolveName(address);
    //   // return currentAddress;
    // } catch (e) {
    //   return null;
    // }
  }
};

export const parseUint = (value) => {
  if (parseInt(value) < 0) {
    return "0";
  }
  return value;
};

export const toUSD = (amount, price) => parseFloat(amount) * parseFloat(price);

export const tsToDateString = (ts) => {
  const dt = new Date(ts * 1000);
  return dt.toLocaleDateString();
};

export const sendNotification = async (
  title,
  body,
  duration = 3000,
  fn = () => {},
  delay = 0,
  className = ""
) => {
  const toastConstant = (
    <div className="body">
      <img src={toasty} alt="toasty" className="toasty" />
      <h5>{title}</h5>
      <p>{body}</p>
    </div>
  );

  toast(toastConstant, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: duration,
    hideProgressBar: true,
    delay,
    className,
    onClose: () => {
      fn();
    },
  });
};

export const errorNotification = async (body) => {
  const title = "❌ Whoopsie!";
  sendNotification(title, body, 3000, () => {}, 0, "error");
};

export const notifyUser = async (tx, fn = () => {}) => {
  try {
    let notificationTitle = "⏰ Transaction Sent!";
    let notificationBody = "Please wait for the transaction confirmation.";
    sendNotification(notificationTitle, notificationBody, false);

    await tx.wait(1);

    toast.dismiss();

    notificationTitle = "✔️ Transaction Confirmed!";
    notificationBody = "All set, please wait for another confirmation";
    sendNotification(
      notificationTitle,
      notificationBody,
      3000,
      fn,
      1000,
      "success"
    );

    // In case the graph isn't updated on the first transaction, try to update on second transaction.
    await tx.wait(3);

    fn();
  } catch (error) {
    console.error(error);
  }
};

export const getRatio = async (
  collateral,
  collateralPrice,
  debt,
  tcapPrice
) => {
  const c = parseFloat(collateral);
  const cp = parseFloat(collateralPrice);
  const d = parseFloat(debt);
  const tp = parseFloat(tcapPrice);
  if (d === 0 || tp === 0) return 0;
  const ratio = (c * cp * 100) / (d * tp);
  return ratio;
};

export const getSafeMint = async (
  ratio,
  collateral,
  collateralPrice,
  tcapPrice,
  debt
) => {
  const r = parseFloat(ratio) + 50;
  const c = parseFloat(collateral);
  const cp = parseFloat(collateralPrice);
  const tp = parseFloat(tcapPrice);
  const d = parseFloat(debt);
  if (r === 0 || tp === 0) return 0;
  const safeMint = (c * cp * 100) / (r * tp);

  const result = safeMint - d;
  if (result < 0) {
    return 0;
  }
  return result;
};

export const getSafeRemoveCollateral = async (
  ratio,
  collateral,
  collateralPrice,
  tcapPrice,
  debt
) => {
  const r = parseFloat(ratio) + 50;
  const c = parseFloat(collateral);
  const cp = parseFloat(collateralPrice);
  const tp = parseFloat(tcapPrice);
  const d = parseFloat(debt);
  if (cp === 0) return 0;
  const n = (r * d * tp) / (cp * 100);

  const result = c - n;
  if (result < 0) {
    return 0;
  }
  return result;
};

export const getProposalStatus = (
  startBlock,
  endBlock,
  currentBlock,
  forVotes,
  againstVotes,
  quorumVotes,
  eta,
  gracePeriod
) => {
  const currentBlockTime = currentBlock * 13 * 1000;
  if (currentBlock <= startBlock) {
    return "PENDING";
  }
  if (currentBlock <= endBlock) {
    return "ACTIVE";
  }
  if (forVotes <= againstVotes || forVotes < quorumVotes) {
    return "DEFEATED";
  }
  if (eta === 0) {
    return "SUCCEEDED";
  }
  if (currentBlockTime >= eta + gracePeriod) {
    return "EXPIRED";
  }
  if (currentBlockTime >= eta) {
    return "READY";
  }
  return "QUEUED";
};

export const getPriceInUSDFromPair = (reserves0, reservesAVAX, avaxPrice) => {
  const one = ethers.utils.parseEther("1");
  // if ((await pair.token1()) != WAVAX) {
  //   throw "UniswapV2Pair must be paired with WAVAX"; // Being lazy for now. (modify later for Pangolin/Trader Joe)
  // }

  // const reserves0 = resp[0];
  // const reservesWAVAX = resp[1];

  // amount of token0 required to by 1 WAVAX
  const amt = parseFloat(
    ethers.utils.formatEther(one.mul(reserves0).div(reservesAVAX))
  );
  return avaxPrice / amt;
};
