import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../state/ThemeContext";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { ethers, BigNumber } from "ethers";
import SignerContext from "../../state/SignerContext";
import { errorNotification, notifyUser } from "../../utils/utils";

export const Stake = ({
  show,
  poolTitle,
  poolToken,
  pool,
  balance,
  onHide,
  refresh,
}) => {
  const [stakeText, setStakeText] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const signer = useContext(SignerContext);
  const { isDarkMode } = useContext(ThemeContext);

  // Infinite Approval
  const infiniteApproveValue = BigNumber.from(
    "1157920892373161954235709850086879078532699"
  );

  useEffect(() => {
    async function load() {
      if (poolToken && signer.signer) {
        const currentAddress = await signer.signer.getAddress();
        const approved = await poolToken.allowance(
          currentAddress,
          pool?.address
        );

        if (approved.toString() !== "0") {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    }
    load();
    // eslint-disable-next-line
  }, [poolToken]);

  const onChangeStake = (event) => {
    setStakeText(event.target.value);
  };

  const stakeTokens = async (event) => {
    event.preventDefault();
    if (pool) {
      if (stakeText) {
        try {
          const tx = await pool.stake(ethers.utils.parseEther(stakeText));
          notifyUser(tx, refresh);
          setStakeText("");
          onHide();
        } catch (error) {
          if (error.code === 4001) {
            errorNotification("Transaction rejected");
          } else {
            errorNotification("Token not approved yet");
          }
        }
      } else {
        errorNotification("Field can't be empty");
      }
    }
  };

  const infiniteApproveTokens = async (event) => {
    event.preventDefault();
    if (poolToken) {
      try {
        const tx = await poolToken.approve(pool?.address, infiniteApproveValue);
        notifyUser(tx, refresh);
        setStakeText("");
        setIsApproved(true);
      } catch (error) {
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          console.log(error);
        }
      }
    }
  };

  const maxStake = async (e) => {
    e.preventDefault();
    setStakeText(balance);
  };

  return (
    <div
      className={`stake-modal-container ${
        isDarkMode && "stake-modal-container-dark-mode"
      }`}
    >
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setStakeText("");
          onHide();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Stake {poolTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Current Balance: <b>{balance}</b>
          </p>
          <Form>
            <Form.Group>
              {isApproved ? (
                <>
                  <Form.Label>Amount to Stake</Form.Label>
                  <Form.Label className="max">
                    <a href="/" className="number" onClick={maxStake}>
                      MAX
                    </a>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="0"
                    className="neon-green"
                    value={stakeText}
                    onChange={onChangeStake}
                  />
                </>
              ) : (
                <></>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isApproved ? (
            <>
              <Button
                variant="primary"
                className="neon-highlight"
                onClick={stakeTokens}
              >
                Stake Tokens
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                className="neon-green"
                onClick={infiniteApproveTokens}
              >
                Approve Staking
              </Button>
            </>
          )}{" "}
          Tokens
        </Modal.Footer>
      </Modal>
    </div>
  );
};
