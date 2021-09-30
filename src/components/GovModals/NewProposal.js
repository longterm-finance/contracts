import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { ethers } from "ethers";
import governanceContext from "../../state/GovernanceContext";
import { errorNotification, notifyUser } from "../../utils/utils";
import { ThemeContext } from "../../state/ThemeContext";

export const NewProposal = ({ show, onHide, refresh }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const governance = useContext(governanceContext);
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [signature, setSignature] = useState("");
  const [values, setValues] = useState("");

  const onChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const onChangeTarget = (event) => {
    setTarget(event.target.value);
  };

  const onChangeSignature = (event) => {
    setSignature(event.target.value);
  };

  const onChangeValues = (event) => {
    setValues(event.target.value);
  };

  const createProposal = async (event) => {
    event.preventDefault();

    if (governance.governorAlpha) {
      if (description !== "") {
        try {
          const targets = [target];
          const msgValues = ["0"];
          const signatures = [signature];
          const abi = new ethers.utils.AbiCoder();
          const start = signature.indexOf("(") + 1;
          const end = signature.indexOf(")");
          const types = signature.substring(start, end).split(",");
          const valuesArray = values.split(",");
          const calldata = abi.encode(types, valuesArray);
          const calldatas = [calldata];
          const tx = await governance.governorAlpha.propose(
            targets,
            msgValues,
            signatures,
            calldatas,
            description
          );

          notifyUser(tx, refresh);
          setDescription("");
          onHide();
        } catch (error) {
          if (error.code === 4001) {
            errorNotification("Transaction rejected");
          } else {
            errorNotification("Description can't be empty");
          }
        }
      } else {
        errorNotification("Description can't be empty");
      }
    }
  };

  return (
    <div
      className={`new-proposal-container ${
        isDarkMode && "new-proposal-container-dark-mode"
      }`}
    >
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide}
        className="green"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Proposal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Create a new proposal with a maximun of 10 actions. You need a total
            of at least 50,000 aVIX delegated to your address in order to create
            a new proposal.
          </p>
          <Form>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                className="neon-green"
                value={description}
                onChange={onChangeDescription}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Target Contract</Form.Label>
              <Form.Control
                type="text"
                placeholder="0x..." // ADD ORCHESTRATOR.SOL CONTRACT ADDRESS HERE
                className="neon-green"
                onChange={onChangeTarget}
                value={target}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Function to Call</Form.Label>
              <Form.Control
                type="text"
                className="neon-green"
                placeholder="setRatio(address, uint256)"
                onChange={onChangeSignature}
                value={signature}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Values</Form.Label>
              <Form.Control
                type="text"
                placeholder="0...,250"
                className="neon-green"
                onChange={onChangeValues}
                value={values}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            className="neon-green"
            onClick={createProposal}
          >
            Create Proposal
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
