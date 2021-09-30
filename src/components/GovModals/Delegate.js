import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import governanceContext from "../../state/GovernanceContext";
import {
  isValidAddress,
  errorNotification,
  notifyUser,
} from "../../utils/utils";
import tokensContext from "../../state/TokensContext";
import { ThemeContext } from "../../state/ThemeContext";

export const Delegate = ({ show, onHide, refresh }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const governance = useContext(governanceContext);
  const tokens = useContext(tokensContext);
  const [addressText, setAddressText] = useState("");

  const onChangeAddress = (event) => {
    setAddressText(event.target.value);
  };

  const delegateAVIX = async (event) => {
    event.preventDefault();

    if (governance && tokens) {
      const validAddress = await isValidAddress(addressText);

      if (validAddress && tokens.avixToken) {
        try {
          const tx = await tokens.avixToken.delegate(validAddress);
          notifyUser(tx, refresh);
          setAddressText("");
          onHide();
        } catch (error) {
          if (error.code === 4001) {
            errorNotification("Transaction rejected");
          } else {
            errorNotification("Invalid address");
          }
        }
      } else {
        errorNotification("Invalid address");
      }
    }
  };
  return (
    <div
      className={`delegate-container ${
        isDarkMode && "delegate-container-dark-mode"
      }`}
    >
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delegate aVIX
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Delegate your aVIX tokens to an Adress so it can vote for you.</p>
          <Form>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Delegatee Address"
                className="neon-green"
                value={addressText}
                onChange={onChangeAddress}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="neon-highlight"
            onClick={delegateAVIX}
          >
            Delegate Tokens
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
