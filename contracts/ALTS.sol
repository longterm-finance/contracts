// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./utils/ERC20.sol";
import "./utils/Ownable.sol";
import "./utils/IERC165.sol";
import "./utils/SafeMath.sol";
import "./Orchestrator.sol";

/**
 * @title ALTS Token
 * @author LongTerm Finance
 * @notice ERC20 token that tracks the entire crypto market excluding BTC and ETH
 */
contract ALTS is ERC20, Ownable, IERC165 {
  /// @notice Open Zeppelin libraries
  using SafeMath for uint256;

  /// @notice if enabled ALTS can't be minted if the total supply is above or equal the cap value
  bool public capEnabled = false;

  /// @notice Maximum value the total supply of ALTS
  uint256 public cap;
  
  // @notice: Address that sets the orchestrator after the contract deployment
  address public orchestratorSetter;
  
  // @notice: Orchestrator address
  Orchestrator public orchestrator;

  /**
   * @notice Address to Vault Handler
   * @dev Only vault handlers can mint and burn ALTS
   */
  mapping(address => bool) public vaultHandlers;

  /**
   * @dev the computed interface ID according to ERC-165. The interface ID is a XOR of interface method selectors.
   * mint.selector ^
   * burn.selector ^
   * setCap.selector ^
   * enableCap.selector ^
   * transfer.selector ^
   * transferFrom.selector ^
   * addVaultHandler.selector ^
   * removeVaultHandler.selector ^
   * approve.selector => 0xbd115939
   */
  bytes4 private constant _INTERFACE_ID_ALTS = 0xbd115939;

  /// @dev bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
  bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

  /// @notice An event emitted when a vault handler is added
  event VaultHandlerAdded(
    address indexed _owner,
    address indexed _tokenHandler
  );

  /// @notice An event emitted when a vault handler is removed
  event VaultHandlerRemoved(
    address indexed _owner,
    address indexed _tokenHandler
  );

  /// @notice An event emitted when the cap value is updated
  event NewCap(address indexed _owner, uint256 _amount);

  /// @notice An event emitted when the cap is enabled or disabled
  event NewCapEnabled(address indexed _owner, bool _enable);
  
  /// @notice An event emitted when the orchestrator is set
  event OrchestratorSet(address indexed _setter, Orchestrator _orchestrator);

  /**
   * @notice Constructor
   * @param _name uint256
   * @param _symbol uint256
   * @param _cap uint256
   */
  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _cap
  ) ERC20(_name, _symbol) {
    cap = _cap;

    // Sets the Orchestrator setter
    orchestratorSetter = msg.sender;
  }

  /// @notice Reverts if called by any account that is not a vault.
  modifier onlyVault() {
    require(
      vaultHandlers[msg.sender],
      "ALTS::onlyVault: caller is not a vault"
    );
    _;
  }
  
  /**
   * @notice Sets the Orchestrator
   * @param _orchestrator address of the Orchestrator contract
   * @dev Only orchestratorSetter can call it and it can only be called once
   */
  function setOrchestrator(Orchestrator _orchestrator) public {
    require(msg.sender == orchestratorSetter, "ALTS::setOrchestrator: not allowed to set the orchestrator");
      
    /// @dev transfer ownership to orchestrator
    transferOwnership(address(_orchestrator));
    
    orchestrator = _orchestrator;
    emit OrchestratorSet(orchestratorSetter, _orchestrator);
  }

  /**
   * @notice Adds a new address as a vault
   * @param _vaultHandler address of a contract with permissions to mint and burn tokens
   * @dev Only owner can call it
   */
  function addVaultHandler(address _vaultHandler) external onlyOwner {
    vaultHandlers[_vaultHandler] = true;
    emit VaultHandlerAdded(msg.sender, _vaultHandler);
  }

  /**
   * @notice Removes an address as a vault
   * @param _vaultHandler address of the contract to be removed as vault
   * @dev Only owner can call it
   */
  function removeVaultHandler(address _vaultHandler) external onlyOwner {
    vaultHandlers[_vaultHandler] = false;
    emit VaultHandlerRemoved(msg.sender, _vaultHandler);
  }

  /**
   * @notice Mints ALTS Tokens
   * @param _account address of the receiver of tokens
   * @param _amount uint of tokens to mint
   * @dev Only vault can call it
   */
  function mint(address _account, uint256 _amount) external onlyVault {
    _mint(_account, _amount);
  }

  /**
   * @notice Burns ALTS Tokens
   * @param _account address of the account which is burning tokens.
   * @param _amount uint of tokens to burn
   * @dev Only vault can call it
   */
  function burn(address _account, uint256 _amount) external onlyVault {
    _burn(_account, _amount);
  }

  /**
   * @notice Sets maximum value the total supply of ALTS can have
   * @param _cap value
   * @dev When capEnabled is true, mint is not allowed to issue tokens that would increase the total supply above or equal the specified capacity.
   * @dev Only owner can call it
   */
  function setCap(uint256 _cap) external onlyOwner {
    cap = _cap;
    emit NewCap(msg.sender, _cap);
  }

  /**
   * @notice Enables or Disables the Total Supply Cap.
   * @param _enable value
   * @dev When capEnabled is true, minting will not be allowed above the max capacity. It can exist a supply above the cap, but it prevents minting above the cap.
   * @dev Only owner can call it
   */
  function enableCap(bool _enable) external onlyOwner {
    capEnabled = _enable;
    emit NewCapEnabled(msg.sender, _enable);
  }

  /**
   * @notice ERC165 Standard for support of interfaces
   * @param _interfaceId bytes of interface
   * @return bool
   */
  function supportsInterface(bytes4 _interfaceId)
    external
    pure
    override
    returns (bool)
  {
    return (_interfaceId == _INTERFACE_ID_ALTS ||
      _interfaceId == _INTERFACE_ID_ERC165);
  }

  /**
   * @notice executes before each token transfer or mint
   * @param _from address
   * @param _to address
   * @param _amount value to transfer
   * @dev See {ERC20-_beforeTokenTransfer}.
   * @dev minted tokens must not cause the total supply to go over the cap.
   * @dev Reverts if the to address is equal to token address
   */
  function _beforeTokenTransfer(
    address _from,
    address _to,
    uint256 _amount
  ) internal virtual override {
    super._beforeTokenTransfer(_from, _to, _amount);

    require(
      _to != address(this),
      "ALTS::transfer: can't transfer to ALTS contract"
    );

    if (_from == address(0) && capEnabled) {
      // When minting tokens
      require(
        totalSupply().add(_amount) <= cap,
        "ALTS::Transfer: ALTS cap exceeded"
      );
    }
  }
}