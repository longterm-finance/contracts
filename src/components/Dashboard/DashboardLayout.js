import React, { useState, useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import "./dashboard.css";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import transparentPNGLogo from "../../assets/images/logo_transparent_bg.png";
import vaultIcon from "../../assets/images/vault.svg";
import whiteVaultIcon from "../../assets/images/vault_white.svg";
import greyVaultIcon from "../../assets/images/vault_grey.svg";
import { Modal } from "semantic-ui-react";
import { ThemeContext } from "../../state/ThemeContext";
import Nav from "react-bootstrap/esm/Nav";
import BSButton from "react-bootstrap/esm/Button"; // BSButton = Bootstrap Button
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { ethers } from "ethers";
import NumberFormat from "react-number-format";
import SignerContext from "../../state/SignerContext";
import { Web3ModalContext } from "../../state/Web3ModalContext";
import TokensContext from "../../state/TokensContext";
import { makeShortAddress } from "../../utils/utils";
import dvix from "../../assets/images/dvix_logo_new.png";
import logoutIcon from "../../assets/images/logout.png";

const Icon = ({ src, alt }) => (
  <img src={src} alt={alt} width="42" height="42" className="trade-icon-1" />
);

//  TODO: On change account reload page

export const Header = () => {
  const web3Modal = useContext(Web3ModalContext);
  const signer = useContext(SignerContext);
  const tokens = useContext(TokensContext);
  const [address, setAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0.0");

  const copyCodeToClipboard = (e) => {
    e.preventDefault();
    // Create new element
    const el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = address;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand("copy");
    // Remove temporary element
    document.body.removeChild(el);
  };

  useEffect(() => {
    const loadAddress = async () => {
      if (signer.signer && tokens.tcapToken) {
        const currentAddress = await signer.signer?.getAddress();
        const filterMint = tokens.tcapToken.filters.Transfer(
          null,
          currentAddress
        );
        const filterBurn = tokens.tcapToken.filters.Transfer(
          currentAddress,
          null
        );
        tokens.tcapToken.on(filterMint, async () => {
          const currentBalance = await tokens.tcapToken?.balanceOf(
            currentAddress
          );
          setTokenBalance(ethers.utils.formatEther(currentBalance));
        });

        tokens.tcapToken.on(filterBurn, async () => {
          const currentBalance = await tokens.tcapToken?.balanceOf(
            currentAddress
          );
          setTokenBalance(ethers.utils.formatEther(currentBalance));
        });
        setAddress(currentAddress);
        const currentTcapBalance = await tokens.tcapToken.balanceOf(
          currentAddress
        );
        setTokenBalance(ethers.utils.formatEther(currentTcapBalance));
      }
    };

    loadAddress();
    // eslint-disable-next-line
  }, [signer]);

  return (
    <div className="trade-container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Nav className="header">
        {signer.signer ? (
          <>
            <Icon src={dvix} alt="dvix" />
            <h5>
              <NumberFormat
                className="number mx-2 neon-pink"
                value={tokenBalance}
                displayType="text"
                thousandSeparator
                prefix=""
                decimalScale={2}
              />
            </h5>
            <h5>
              <OverlayTrigger
                key="bottom"
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">Click to Copy</Tooltip>}
              >
                <a href="/" onClick={copyCodeToClipboard} className="address">
                  {makeShortAddress(address)}
                </a>
              </OverlayTrigger>
            </h5>
            <Link
              to=""
              onClick={(event) => {
                event.preventDefault();
                web3Modal.clearCachedProvider();
                window.location.reload();
              }}
            >
              <Icon src={logoutIcon} alt={"Logout"} />
            </Link>
          </>
        ) : (
          <BSButton
            variant="pink"
            className="neon-pink"
            onClick={() => {
              web3Modal.toggleModal();
            }}
          >
            Connect Wallet
          </BSButton>
        )}
      </Nav>
    </div>
  );
};

// @TODO:
// 1- Add a button that adds the Avalanche mainnet to user's wallet
// programatically if they are connected to the wrong chain (e.g.
// if you get Wrong Network or Error connecting errors when attempting
// to connect the user to MetaMask)
// Code:
// import injected from "web3-react/injected-connector"
// function addAvalancheNetwork() {
//   injected.getProvider().then(provider => {
//     provider
//       .request({
//         method: 'wallet_addEthereumChain',
//         params: [AVALANCHE_MAINNET_PARAMS]
//       })
//       .catch((error: any) => {
//         console.log(error)
//       })
//   })
// }
// In the UI:
// eslint-disable-next-line
{
  /* <div>
  <h1>Wrong Network</h1>
  <p>Please connect to the Avlanache Chain to start using the app.</p>
  <button onClick={addAvalancheNetwork}>Switch to Avalanche Chain</button>
</div> */
}

const DashboardLayout = () => {
  const { switchTheme, isDarkMode } = useContext(ThemeContext);

  let active = 0x000000000000000000000000000000000000000000000000000000000000000000000000
    ? true
    : false;

  const [toggleAccountModal, setToggleAccountModal] = useState(false);
  const [mouseOverCopy, setMouseOverCopy] = useState();
  const [copyAddressClicked, setCopyAddressClicked] = useState(false);

  const openAccountModal = () => setToggleAccountModal(true);
  const closeAccountModal = () => setToggleAccountModal(false);

  const onMouseOver = () => setMouseOverCopy(true);
  const onMouseOut = () => setMouseOverCopy(false);

  const copyAddress = () => {
    const el = document.createElement("input");
    el.value = 0x000000000000000000000000000000000000000000000000000000000000000000000000;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const onCopyAddressClicked = () => {
    setCopyAddressClicked(true);
    setTimeout(() => setCopyAddressClicked(false), 2000);
  };

  const mobileHeader = useMediaQuery({ query: "(max-width: 992px)" });

  const Navbar = () => {
    const MoonIcon = () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isDarkMode ? "none" : "#000"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      );
    };

    const SunIcon = () => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      );
    };

    const ModeSwitcher = () => {
      return (
        <span className={!mobileHeader && "ml-2 mr-3"}>
          <button
            type="button"
            onClick={switchTheme}
            className={`mode-switcher ${!isDarkMode && "mode-switcher-moon"} ${
              mobileHeader && "ml-3"
            }`}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </span>
      );
    };

    const useStyles = makeStyles({
      list: {
        width: 250,
      },
      fullList: {
        width: "auto",
      },
    });

    function SwipeableTemporaryDrawer() {
      const classes = useStyles();
      const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });

      const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

      const list = (anchor) => (
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === "top" || anchor === "bottom",
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          style={{
            backgroundColor: isDarkMode && "#191b1f",
            paddingBottom: isDarkMode && mobileHeader && "250vw",
          }}
        >
          <List className="mobile-menu">
            <Link
              to="/"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <img
                src={isDarkMode ? whiteVaultIcon : vaultIcon}
                alt="Vault"
                className="vault-mobile"
                style={{
                  height: 18,
                  width: 23,
                }}
              />
              <span className="mobile-menu-tab-name">Vault</span>
            </Link>
            <Link
              to="/trade"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <i className="fas fa-sync-alt" />{" "}
              <span className="mobile-menu-tab-name">Trade</span>
            </Link>
            <Link
              to="/pool"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <i className="fas fa-swimming-pool" />{" "}
              <span className="mobile-menu-tab-name">Pool</span>
            </Link>
            <Link
              to="/farm"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <i className="fas fa-tractor" />{" "}
              <span className="mobile-menu-tab-name">Farm</span>
            </Link>
            <Link
              to="/nft"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <i className="fas fa-shapes" />{" "}
              <span className="mobile-menu-tab-name">Collectibles</span>
            </Link>
            <Link
              to="/gov"
              className={`nav-link ${
                isDarkMode && "nav-link-dark-mode"
              } disabled-link`}
            >
              <i className="fas fa-bullhorn" />{" "}
              <span className="mobile-menu-tab-name">Governance</span>
            </Link>
            <link
              to="/stats"
              className={`nav-link ${
                isDarkMode && "nav-link-dark-mode"
              } disabled-link`}
            >
              <i className="fas fa-chart-line" />{" "}
              <span className="mobile-menu-tab-name">Stats</span>
            </link>
            <Link
              to="/learn"
              className={`nav-link ${isDarkMode && "nav-link-dark-mode"}`}
            >
              <i className="fas fa-book-open" />{" "}
              <span className="mobile-menu-tab-name">Learn</span>
            </Link>
          </List>
          <ModeSwitcher />
          {
            <List className="mobile-menu">
              <button
                className="btn regular-btn mt-3 bold"
                type="button"
                style={{
                  marginLeft: "22px",
                  fontWeight: "bold",
                  height: "50px",
                  fontSize: "1.125em",
                }}
              >
                Connect Wallet
              </button>
            </List>
          }
        </div>
      );

      const styles = {
        largeIcon: {
          width: 35,
          height: 35,
          position: "relative",
          bottom: 3,
        },
      };

      return (
        <div>
          {["right"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button
                style={{ backgroundColor: isDarkMode ? "#191b1f" : "#fafbfd" }}
                onClick={toggleDrawer(anchor, true)}
              >
                <MenuIcon style={styles.largeIcon} className="menu-icon" />
              </Button>
              <SwipeableDrawer
                anchor={"right"}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <nav className={`navbar ${isDarkMode && "navbar-dark-mode"}`}>
        {!mobileHeader ? (
          <React.Fragment>
            <div className="logo">
              <Link to="/">
                <img
                  className="logo-img"
                  src={transparentPNGLogo}
                  alt="Avix Logo"
                />
              </Link>
            </div>
            <div className="nav-links">
              <ModeSwitcher />
              <button
                className="btn regular-btn mr-4"
                type="button"
                style={{
                  fontWeight: "bold",
                  height: "50px",
                  fontSize: "1.125em",
                }}
                onClick={() => {
                  // connect wallet function
                  openAccountModal();
                }}
              >
                Connect Wallet
              </button>
            </div>

            <Modal
              size="mini"
              open={toggleAccountModal}
              onClose={closeAccountModal}
            >
              <Modal.Header
                className="text-center bold"
                style={{ fontSize: "1.75em" }}
              >
                Account
              </Modal.Header>
              <Modal.Content
                className="text-center bold"
                style={{ fontSize: "1.15em" }}
              >
                {active && (
                  <React.Fragment>
                    <i
                      className="far fa-check-circle"
                      style={{
                        color: "green",
                      }}
                    />{" "}
                    Connected with MetaMask
                  </React.Fragment>
                )}
              </Modal.Content>
              <div className="copy-address-btn-container">
                <button
                  className="btn btn-link light-btn border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: "bold",
                    border: "1.5px solid #e84142",
                  }}
                  onClick={() => {
                    copyAddress();
                    onCopyAddressClicked();
                  }}
                  onMouseOver={onMouseOver}
                  onMouseOut={onMouseOut}
                >
                  0x000000000000000000000000000000000000000000000000000000000000000000000000
                  {mouseOverCopy && <i className="ml-2 far fa-copy" />}
                </button>
                {copyAddressClicked && (
                  <span className="bold ml-3">
                    <i
                      className="far fa-check-circle"
                      style={{
                        color: "green",
                      }}
                    />{" "}
                    Address Copied!
                  </span>
                )}
              </div>
              <div className="account-options">
                <button
                  className="btn light-btn mt-3 mb-4 mr-3 border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: "bold",
                    border: "1.5px solid #e84142",
                  }}
                >
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://cchain.explorer.avax.network/address/${0x000000000000000000000000000000000000000000000000000000000000000000000000}`}
                    className="bold"
                    style={{ color: "#000" }}
                  >
                    View on Explorer
                  </a>
                </button>

                <button
                  className="btn light-btn mt-3 mb-4 border-rad-05 dark-text"
                  type="button"
                  style={{
                    fontWeight: "bold",
                    border: "1.5px solid #e84142",
                  }}
                  onClick={() => {
                    console.log("Disconnect Wallet button clicked");
                  }}
                >
                  Disconnect
                </button>
              </div>
            </Modal>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              className="logo"
              style={{
                position: "relative",
                right: 25,
              }}
            >
              <Link to="/">
                <img
                  className="logo-img logo-img-header"
                  src={transparentPNGLogo}
                  alt="Avix Logo"
                  style={{
                    margin: "auto",
                    position: "relative",
                    right: "20",
                  }}
                />
              </Link>
            </div>
            <SwipeableTemporaryDrawer />
          </React.Fragment>
        )}
      </nav>
    );
  };

  class SidebarItem extends React.Component {
    handleClick = () => {
      const { path, onItemClick } = this.props;
      onItemClick(path);
    };

    render() {
      const { active } = this.props;

      return (
        <React.Fragment>
          <Link
            active={active}
            className={`pt-4 ${
              active ? "sidebar-item-active" : "sidebar-item"
            } ${this.props.css}`}
            to={this.props.path}
            onClick={this.handleClick}
            style={{ color: active ? "#fff" : "#b8b4b4" }}
          >
            {this.props.path === "/" && (
              <img
                src={active ? whiteVaultIcon : greyVaultIcon}
                alt="Vault"
                className="vault"
                style={{
                  width: 22.5,
                  height: 22.5,
                }}
              />
            )}
            <span
              className="sidebar-tab-name"
              style={{
                position: this.props.path === "/" && "relative",
                top: this.props.path === "/" && "1.5px",
              }}
            >
              {this.props.name}
            </span>
          </Link>
        </React.Fragment>
      );
    }
  }

  class Sidebar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activePath: props.location.pathname,
        items: [
          {
            path: "/",
            name: "Vaults",
            css: "fas vault",
            key: Math.random(),
          },
          {
            path: "/trade",
            name: "Trade",
            css: "fas fa-sync-alt",
            key: Math.random() + 1,
          },
          {
            path: "/pool",
            name: "Pool",
            css: "fas fa-swimming-pool",
            key: Math.random() + 2,
          },
          {
            path: "/farm",
            name: "Farm",
            css: "fas fa-tractor",
            key: Math.random() + 3,
          },
          {
            path: "/nft",
            name: "Collectibles",
            css: "fas fa-shapes",
            key: Math.random() + 4,
          },
          {
            path: "/gov",
            name: "Governance",
            css: "fas fa-bullhorn",
            key: Math.random() + 5,
          },
          {
            path: "/stats",
            name: "Stats",
            css: "fas fa-chart-line",
            key: Math.random() + 6,
          },
          {
            path: "/learn",
            name: "Learn",
            css: "fas fa-book-open",
            key: Math.random() + 7,
          },
        ],
      };
    }

    onItemClick = (path) => {
      this.setState({ activePath: path });
    };

    render() {
      const { items, activePath } = this.state;
      return (
        <div className={isDarkMode ? "sidebar sidebar-dark-mode" : "sidebar"}>
          {items.map((item) => {
            return (
              <SidebarItem
                path={item.path}
                name={item.name}
                css={item.css}
                onItemClick={this.onItemClick}
                active={item.path === activePath}
                key={item.key}
              />
            );
          })}
        </div>
      );
    }
  }

  const RouterSidebar = withRouter(Sidebar);

  return (
    <div className="dashboard-layout">
      <Navbar />
      {!mobileHeader && <RouterSidebar />}
    </div>
  );
};

export default DashboardLayout;
