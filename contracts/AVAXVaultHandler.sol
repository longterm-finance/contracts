// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./IVaultHandler.sol";
import "./Orchestrator.sol";
import "./IWAVAX.sol";
import "./utils/SafeMath.sol";

/**
 * @title AVAX Avix Vault
 * @author Avix Finance
 * @notice Contract in charge of handling the dVIX Vault and stake using a AVAX and WAVAX
 */
contract AVAXVaultHandler is IVaultHandler {
  /// @notice Open Zeppelin libraries
  using SafeMath for uint256;

  /**
   * @notice Constructor
   * @param _orchestrator address
   * @param _divisor uint256
   * @param _ratio uint256
   * @param _burnFee uint256
   * @param _liquidationPenalty uint256
   * @param _vixOracle address
   * @param _dvixAddress address
   * @param _collateralAddress address
   * @param _collateralOracle address
   * @param _avaxOracle address
   * @param _rewardHandler address
   * @param _treasury address
   */
  constructor(
    Orchestrator _orchestrator,
    uint256 _divisor,
    uint256 _ratio,
    uint256 _burnFee,
    uint256 _liquidationPenalty,
    address _vixOracle, // used to calculate the price of dVIX
    DVIX _dvixAddress,
    address _collateralAddress,
    address _collateralOracle,
    address _avaxOracle,
    address _rewardHandler,
    address _treasury
  )
    IVaultHandler(
      _orchestrator,
      _divisor,
      _ratio,
      _burnFee,
      _liquidationPenalty,
      _vixOracle,
      _dvixAddress,
      _collateralAddress,
      _collateralOracle,
      _avaxOracle,
      _rewardHandler,
      _treasury
    )
  {}

  /**
   * @notice only accept AVAX via fallback from the WAVAX contract
   */
  receive() external payable {
    assert(msg.sender == address(collateralContract));
  }

  /**
   * @notice Adds collateral to vault using AVAX
   * @dev value should be higher than 0 AVAX
   * @dev AVAX is turned into WAVAX
   */
  function addCollateralAVAX()
    external
    payable
    nonReentrant
    vaultExists
    whenNotPaused
  {
    require(
      msg.value > 0,
      "AVAXVaultHandler::addCollateralAVAX: value can't be 0 AVAX"
    );
    IWAVAX(address(collateralContract)).deposit{value: msg.value}();
    Vault storage vault = vaults[userToVault[msg.sender]];
    vault.Collateral = vault.Collateral.add(msg.value);
    emit CollateralAdded(msg.sender, vault.Id, msg.value);
  }

  /**
   * @notice Removes not used collateral from vault
   * @param _amount of collateral to remove
   * @dev _amount should be higher than 0 AVAX
   * @dev WAVAX is turned into AVAX
   */
  function removeCollateralAVAX(uint256 _amount)
    external
    nonReentrant
    vaultExists
    whenNotPaused
  {
    require(
      _amount > 0,
      "AVAXVaultHandler::removeCollateralAVAX: value can't be 0 AVAX"
    );
    Vault storage vault = vaults[userToVault[msg.sender]];
    uint256 currentRatio = getVaultRatio(vault.Id);
    require(
      vault.Collateral >= _amount,
      "AVAXVaultHandler::removeCollateralAVAX: retrieve amount higher than collateral"
    );
    vault.Collateral = vault.Collateral.sub(_amount);
    if (currentRatio != 0) {
      require(
        getVaultRatio(vault.Id) >= ratio,
        "AVAXVaultHandler::removeCollateralAVAX: collateral below min required ratio"
      );
    }

    IWAVAX(address(collateralContract)).withdraw(_amount);
    safeTransferAVAX(msg.sender, _amount);
    emit CollateralRemoved(msg.sender, vault.Id, _amount);
  }
}