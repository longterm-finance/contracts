import React, { useContext } from "react";
import { ThemeContext } from "../../state/ThemeContext";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { ethers } from "ethers";
import governanceContext from "../../state/GovernanceContext";
import { errorNotification, notifyUser } from "../../utils/utils";

export const Vote = ({
  show,
  onHide,
  proposal,
  forVote,
  against,
  endTime,
  status,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  const governance = useContext(governanceContext);
  if (!proposal) {
    return <></>;
  }

  const denominator = forVote + against;
  const forRate = denominator !== 0 ? (forVote / denominator) * 100 : 0;
  const againstRate = denominator !== 0 ? (against / denominator) * 100 : 0;
  const animated = status === "PENDING";

  const abi = new ethers.utils.AbiCoder();

  const explorerURL = process?.env?.REACT_APP_EXPLORER;

  const clickVote = async (support) => {
    if (governance.governorBeta) {
      try {
        const tx = await governance.governorBeta.castVote(proposal.id, support);

        notifyUser(tx);
        onHide();
      } catch (error) {
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          onHide();
          errorNotification("Voter already voted");
        }
      }
    }
  };

  return (
    <div
      className={`vote-container ${isDarkMode && "vote-container-dark-mode"}`}
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
            {proposal.description}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              Targets:{" "}
              {proposal.targets.map((target, i) => {
                let targetDescription = target;
                if (target === "0x...") {
                  // ADD ORCHESTRATOR.SOL CONTRACT ADDRESS HERE
                  targetDescription = "Orchestrator";
                }
                if (i === 0) {
                  return (
                    <b key={i}>
                      <a href={`${explorerURL}}/address/${target}`}>
                        {targetDescription}
                      </a>
                    </b>
                  );
                }

                return (
                  <b key={i}>
                    ,{" "}
                    <a href={`${explorerURL}}/address/${target}`}>
                      {targetDescription}
                    </a>
                  </b>
                );
              })}
            </li>
            <li>
              Actions:{" "}
              {proposal.signatures.map((signature, i) => {
                if (i === 0) {
                  return <b key={i}>{signature}</b>;
                }
                return (
                  <>
                    , <b key={i}>{signature},</b>
                  </>
                );
              })}
            </li>
            <li>
              Values:{" "}
              {proposal.calldatas.map((calldata, i) => {
                const decodedCalldata = abi.decode(
                  ["address", "uint256"],
                  calldata
                );
                if (i === 0) {
                  return <b key={i}>[{decodedCalldata.toString()}]</b>;
                }
                return (
                  <>
                    , <b key={i}>[{decodedCalldata.toString()}]</b>
                  </>
                );
              })}
            </li>
            <li>
              Voting Ends: <b>{endTime}</b>
            </li>
            <li>
              Status: <b>{status.charAt(0) + status.slice(1).toLowerCase()}</b>
            </li>
          </ul>

          {denominator !== 0 ? (
            <ProgressBar>
              <ProgressBar
                variant="primary"
                now={forRate}
                key={1}
                animated={animated}
                label={`For 👍: ${forVote.toLocaleString()}`}
              />
              <ProgressBar
                variant="warning"
                now={againstRate}
                key={2}
                animated={animated}
                label={`Against 👎: ${against.toLocaleString()}"`}
              />
            </ProgressBar>
          ) : (
            <h5>No votes yet!</h5>
          )}
          <Row className="mt-4">
            {status !== "ACTIVE" ? (
              <Col>
                <Button
                  variant="primary"
                  className="neon-highlight"
                  onClick={() => {
                    onHide();
                  }}
                >
                  Close
                </Button>
              </Col>
            ) : (
              <>
                <Col>
                  <Button
                    variant="primary"
                    className="neon-highlight"
                    onClick={() => {
                      clickVote(true);
                    }}
                  >
                    For
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="warning"
                    className="neon-orange"
                    onClick={() => {
                      clickVote(false);
                    }}
                  >
                    Against
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};
