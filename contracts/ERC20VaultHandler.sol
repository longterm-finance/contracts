// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./IVaultHandler.sol";
import "./Orchestrator.sol";

/**
 * @title ERC-20 dVIX Vault
 * @author Avix Finance
 * @notice Contract in charge of handling the dVIX Vault and stake using a Collateral ERC20 tokens 
 */
contract ERC20VaultHandler is IVaultHandler {
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
    address _vixOracle,
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
}