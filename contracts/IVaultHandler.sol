// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/utils/SafeCast.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/utils/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/solc-0.7/contracts/introspection/IERC165.sol";
import "./DVIX.sol";
import "./Orchestrator.sol";
import "./oracles/ChainlinkOracle.sol";

interface IRewardHandler {
  function stake(address _staker, uint256 amount) external;

  function withdraw(address _staker, uint256 amount) external;

  function getRewardFromVault(address _staker) external;
}

/**
 * @title dVIX Vault Handler Abstract Contract
 * @author Avix Finance
 * @notice Contract in charge of handling the dVIX Token and stake
 */
abstract contract IVaultHandler is
  Ownable,
  AccessControl,
  ReentrancyGuard,
  Pausable,
  IERC165
{
  /// @notice Open Zeppelin libraries
  using SafeMath for uint256;
  using SafeCast for int256;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  /**
   * @notice Vault object created to manage the mints and burns of dVIX tokens
   * @param Id, unique identifier of the vault
   * @param Collateral, current collateral on vault
   * @param Debt, current amount of dVIX tokens minted
   * @param Owner, owner of the vault
   */
  struct Vault {
    uint256 Id;
    uint256 Collateral;
    uint256 Debt;
    address Owner;
  }

  /// @notice Vault Id counter
  Counters.Counter public counter;

  /// @notice dVIX Token Address
  DVIX public immutable DVIXToken;

  /// @notice VIX Oracle Address
  ChainlinkOracle public immutable vixOracle;

  /// @notice Collateral Token Address (e.g. DAI)
  IERC20 public immutable collateralContract;

  /// @notice Collateral/USD Oracle Address 
  ChainlinkOracle public immutable collateralPriceOracle;

  /// @notice AVAX/USD Oracle Address
  ChainlinkOracle public immutable AVAXPriceOracle;

  /// @notice Value used as divisor with the VIX, commonly used for many financial indices
  uint256 public divisor;

  /// @notice Minimun ratio required to prevent liquidation of vault
  uint256 public ratio;

  /// @notice Fee percentage of the total amount to burn charged on AVAX when burning dVIX Tokens
  uint256 public burnFee;

  /// @notice Penalty charged to vault owner when a vault is liquidated, this value goes to the liquidator
  uint256 public liquidationPenalty;

  /// @notice Address of the contract that gives rewards to minters of dVIX, rewards are only given if address is set in constructor
  IRewardHandler public immutable rewardHandler;

  /// @notice Address of the dev team contract (usually a multisig address) where the funds generated by the protocol are sent
  address public devAddress;

  /// @notice Owner address to Vault Id
  mapping(address => uint256) public userToVault;

  /// @notice Id To Vault
  mapping(uint256 => Vault) public vaults;

  /// @notice value used to multiply chainlink oracle for handling decimals
  uint256 public constant oracleDigits = 10000000000;

  /// @notice Minimum value that the ratio can be set to
  uint256 public constant MIN_RATIO = 110;

  /// @notice Maximum value that the burn fee can be set to
  uint256 public constant MAX_FEE = 20;

  /**
   * @dev the computed interface ID according to ERC-165. The interface ID is a XOR of interface method selectors.
   * setRatio.selector ^
   * setBurnFee.selector ^
   * setLiquidationPenalty.selector ^
   * pause.selector ^
   * unpause.selector =>  0x9e75ab0c
   */
  bytes4 private constant _INTERFACE_ID_IVAULT = 0x9e75ab0c;

  /**
   * @dev the computed interface ID according to ERC-165. The interface ID is a XOR of interface method selectors.
   * queueTransaction.selector ^
   * cancelTransaction.selector ^
   * executeTransaction.selector  =>  0x6b5cc770
   */
  bytes4 private constant _INTERFACE_ID_TIMELOCK = 0x6b5cc770;

  /// @dev bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
  bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

  /// @notice An event emitted when the ratio is updated
  event NewRatio(address indexed _owner, uint256 _ratio);

  /// @notice An event emitted when the burn fee is updated
  event NewBurnFee(address indexed _owner, uint256 _burnFee);

  /// @notice An event emitted when the liquidation penalty is updated
  event NewLiquidationPenalty(
    address indexed _owner,
    uint256 _liquidationPenalty
  );

  /// @notice An event emitted when the devAddress is updated
  event NewDevAddress(address indexed _owner, address _devAddress);

  /// @notice An event emitted when a vault is created
  event VaultCreated(address indexed _owner, uint256 indexed _id);

  /// @notice An event emitted when collateral is added to a vault
  event CollateralAdded(
    address indexed _owner,
    uint256 indexed _id,
    uint256 _amount
  );

  /// @notice An event emitted when collateral is removed from a vault
  event CollateralRemoved(
    address indexed _owner,
    uint256 indexed _id,
    uint256 _amount
  );

  /// @notice An event emitted when tokens are minted
  event TokensMinted(
    address indexed _owner,
    uint256 indexed _id,
    uint256 _amount
  );

  /// @notice An event emitted when tokens are burned
  event TokensBurned(
    address indexed _owner,
    uint256 indexed _id,
    uint256 _amount
  );

  /// @notice An event emitted when a vault is liquidated
  event VaultLiquidated(
    uint256 indexed _vaultId,
    address indexed _liquidator,
    uint256 _liquidationCollateral,
    uint256 _reward
  );

  /// @notice An event emitted when a erc20 token is recovered
  event Recovered(address _token, uint256 _amount);

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
   * @param _devAddress address
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
    address _devAddress
  ) {
    require(
      _liquidationPenalty.add(100) < _ratio,
      "VaultHandler::constructor: liquidation penalty too high"
    );
    require(
      _ratio >= MIN_RATIO,
      "VaultHandler::constructor: ratio lower than MIN_RATIO"
    );

    require(
      _burnFee <= MAX_FEE,
      "VaultHandler::constructor: burn fee higher than MAX_FEE"
    );

    divisor = _divisor;
    ratio = _ratio;
    burnFee = _burnFee;
    liquidationPenalty = _liquidationPenalty;
    vixOracle = ChainlinkOracle(_vixOracle);
    collateralContract = IERC20(_collateralAddress);
    collateralPriceOracle = ChainlinkOracle(_collateralOracle);
    AVAXPriceOracle = ChainlinkOracle(_avaxOracle);
    DVIXToken = _dvixAddress;
    rewardHandler = IRewardHandler(_rewardHandler);
    devAddress = _devAddress;

    /// @dev counter starts in 1 as 0 is reserved for empty objects
    counter.increment();

    /// @dev transfer ownership to orchestrator
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    transferOwnership(address(_orchestrator));
  }

  /// @notice Reverts if the user hasn't created a vault.
  modifier vaultExists() {
    require(
      userToVault[msg.sender] != 0,
      "VaultHandler::vaultExists: no vault created"
    );
    _;
  }

  /// @notice Reverts if value is 0.
  modifier notZero(uint256 _value) {
    require(_value != 0, "VaultHandler::notZero: value can't be 0");
    _;
  }

  /**
   * @notice Sets the collateral ratio needed to mint tokens
   * @param _ratio uint
   * @dev Only owner can call it
   */
  function setRatio(uint256 _ratio) external virtual onlyOwner {
    require(
      _ratio >= MIN_RATIO,
      "VaultHandler::setRatio: ratio lower than MIN_RATIO"
    );
    ratio = _ratio;
    emit NewRatio(msg.sender, _ratio);
  }

  /**
   * @notice Sets the burn fee percentage an user pays when burning dVIX tokens
   * @param _burnFee uint
   * @dev Only owner can call it
   */
  function setBurnFee(uint256 _burnFee) external virtual onlyOwner {
    require(
      _burnFee <= MAX_FEE,
      "VaultHandler::setBurnFee: burn fee higher than MAX_FEE"
    );
    burnFee = _burnFee;
    emit NewBurnFee(msg.sender, _burnFee);
  }

  /**
   * @notice Sets the liquidation penalty % charged on liquidation
   * @param _liquidationPenalty uint
   * @dev Only owner can call it
   * @dev recommended value is between 5% and 15% and can't be above 100%
   */
  function setLiquidationPenalty(uint256 _liquidationPenalty)
    external
    virtual
    onlyOwner
  {
    require(
      _liquidationPenalty.add(100) < ratio,
      "VaultHandler::setLiquidationPenalty: liquidation penalty too high"
    );

    liquidationPenalty = _liquidationPenalty;
    emit NewLiquidationPenalty(msg.sender, _liquidationPenalty);
  }

  /**
   * @notice Sets the devAddress where fees are transfered to
   * @param _devAddress address
   * @dev Only owner can call it
   */
  function setDevAddress(address _devAddress) external virtual onlyOwner {
    devAddress = (_devAddress);
    emit NewDevAddress(msg.sender, _devAddress);
  }

  /**
   * @notice Allows an user to create a unique Vault
   * @dev Only one vault per address can be created
   */
  function createVault() external virtual whenNotPaused {
    require(
      userToVault[msg.sender] == 0,
      "VaultHandler::createVault: vault already created"
    );

    uint256 id = counter.current();
    userToVault[msg.sender] = id;
    Vault memory vault = Vault(id, 0, 0, msg.sender);
    vaults[id] = vault;
    counter.increment();
    emit VaultCreated(msg.sender, id);
  }

  /**
   * @notice Allows users to add collateral to their vaults
   * @param _amount of collateral to be added
   * @dev _amount should be higher than 0
   * @dev ERC20 token must be approved first to be used  as collateral
   */
  function addCollateral(uint256 _amount)
    external
    virtual
    nonReentrant
    vaultExists
    whenNotPaused
    notZero(_amount)
  {
    require(
      collateralContract.transferFrom(msg.sender, address(this), _amount),
      "VaultHandler::addCollateral: ERC20 transfer did not succeed"
    );

    Vault storage vault = vaults[userToVault[msg.sender]];
    vault.Collateral = vault.Collateral.add(_amount);
    emit CollateralAdded(msg.sender, vault.Id, _amount);
  }

  /**
   * @notice Allows users to remove collateral currently not being used to generate dVIX tokens from their vaults
   * @param _amount of collateral to remove
   * @dev reverts if the resulting ratio is less than the minimun ratio
   * @dev _amount should be higher than 0
   * @dev transfers the collateral back to the user
   */
  function removeCollateral(uint256 _amount)
    external
    virtual
    nonReentrant
    vaultExists
    whenNotPaused
    notZero(_amount)
  {
    Vault storage vault = vaults[userToVault[msg.sender]];
    uint256 currentRatio = getVaultRatio(vault.Id);

    require(
      vault.Collateral >= _amount,
      "VaultHandler::removeCollateral: retrieve amount higher than collateral"
    );

    vault.Collateral = vault.Collateral.sub(_amount);
    if (currentRatio != 0) {
      require(
        getVaultRatio(vault.Id) >= ratio,
        "VaultHandler::removeCollateral: collateral below min required ratio"
      );
    }
    require(
      collateralContract.transfer(msg.sender, _amount),
      "VaultHandler::removeCollateral: ERC20 transfer did not succeed"
    );
    emit CollateralRemoved(msg.sender, vault.Id, _amount);
  }

  /**
   * @notice Uses collateral to generate debt on dVIX Tokens which are minted and assigend to caller
   * @param _amount of tokens to mint
   * @dev _amount should be higher than 0
   * @dev requires to have a vault ratio above the minimum ratio
   * @dev if reward handler is set stake to earn rewards
   */
  function mint(uint256 _amount)
    external
    virtual
    nonReentrant
    vaultExists
    whenNotPaused
    notZero(_amount)
  {
    Vault storage vault = vaults[userToVault[msg.sender]];
    uint256 collateral = requiredCollateral(_amount);

    require(
      vault.Collateral >= collateral,
      "VaultHandler::mint: not enough collateral"
    );

    vault.Debt = vault.Debt.add(_amount);
    require(
      getVaultRatio(vault.Id) >= ratio,
      "VaultHandler::mint: collateral below min required ratio"
    );

    if (address(rewardHandler) != address(0)) {
      rewardHandler.stake(msg.sender, _amount);
    }

    DVIXToken.mint(msg.sender, _amount);
    emit TokensMinted(msg.sender, vault.Id, _amount);
  }

  /**
   * @notice Pays the debt of dVIX tokens resulting them on burn, this releases collateral up to minimun vault ratio
   * @param _amount of tokens to burn
   * @dev _amount should be higher than 0
   * @dev A fee of exactly burnFee must be sent as value on AVAX
   * @dev The fee goes to the dev team to fund the further project development & expansion initiatives
   * @dev if reward handler is set exit rewards
   */
  function burn(uint256 _amount)
    external
    payable
    virtual
    nonReentrant
    vaultExists
    whenNotPaused
    notZero(_amount)
  {
    uint256 fee = getFee(_amount);
    require(
      msg.value >= fee,
      "VaultHandler::burn: burn fee less than required"
    );

    Vault memory vault = vaults[userToVault[msg.sender]];

    _burn(vault.Id, _amount);

    if (address(rewardHandler) != address(0)) {
      rewardHandler.withdraw(msg.sender, _amount);
      rewardHandler.getRewardFromVault(msg.sender);
    }
    safeTransferAVAX(devAddress, fee);
 
    // send back AVAX above fee (i.e. refund the user)
    safeTransferAVAX(msg.sender, msg.value.sub(fee));
    emit TokensBurned(msg.sender, vault.Id, _amount);
  }

  /**
   * @notice Allow users to burn dVIX tokens to liquidate vaults with vault collateral ratio under the minium ratio, the liquidator receives the staked collateral of the liquidated vault at a premium
   * @param _vaultId to liquidate
   * @param _maxDVIX max amount of DVIX the liquidator is willing to pay to liquidate vault
   * @dev Resulting ratio must be above or equal minimun ratio
   * @dev A fee of exactly burnFee must be sent as value on AVAX
   * @dev The fee goes to the dev team to fund the further project development & expansion initiatives
   */
  function liquidateVault(uint256 _vaultId, uint256 _maxDVIX)
    external
    payable
    nonReentrant
    whenNotPaused
  {
    Vault storage vault = vaults[_vaultId];
    require(vault.Id != 0, "VaultHandler::liquidateVault: no vault created");

    uint256 vaultRatio = getVaultRatio(vault.Id);
    require(
      vaultRatio < ratio,
      "VaultHandler::liquidateVault: vault is not liquidable"
    );

    uint256 requiredDVIX = requiredLiquidationDVIX(vault.Id);
    require(
      _maxDVIX >= requiredDVIX,
      "VaultHandler::liquidateVault: liquidation amount different than required"
    );

    uint256 fee = getFee(requiredDVIX);
    require(
      msg.value >= fee,
      "VaultHandler::liquidateVault: burn fee less than required"
    );

    uint256 reward = liquidationReward(vault.Id);
    _burn(vault.Id, requiredDVIX);

    //Removes the collateral that is rewarded to liquidator
    vault.Collateral = vault.Collateral.sub(reward);

    // Triggers update of AVIX Rewards
    if (address(rewardHandler) != address(0)) {
      rewardHandler.withdraw(vault.Owner, requiredDVIX);
    }

    require(
      collateralContract.transfer(msg.sender, reward),
      "VaultHandler::liquidateVault: ERC20 transfer did not succeed"
    );
    safeTransferAVAX(devAddress, fee);

    // send back AVAX above fee (i.e. refund the user)
    safeTransferAVAX(msg.sender, msg.value.sub(fee));
    emit VaultLiquidated(vault.Id, msg.sender, requiredDVIX, reward);
  }

  /**
   * @notice Allows the owner to Pause the Contract
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @notice Allows the owner to Unpause the Contract
   */
  function unpause() external onlyOwner {
    _unpause();
  }

  /**
   * @notice  Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
   * @param _tokenAddress address
   * @param _tokenAmount uint
   * @dev Only owner can call it
   */
  function recoverERC20(address _tokenAddress, uint256 _tokenAmount)
    external
    onlyOwner
  {
    // Cannot recover the collateral token
    require(
      _tokenAddress != address(collateralContract),
      "Cannot withdraw the collateral tokens"
    );
    IERC20(_tokenAddress).safeTransfer(owner(), _tokenAmount);
    emit Recovered(_tokenAddress, _tokenAmount);
  }

  /**
   * @notice Allows the safe transfer of AVAX
   * @param _to account to transfer AVAX
   * @param _value amount of AVAX
   */
  function safeTransferAVAX(address _to, uint256 _value) internal {
    (bool success, ) = _to.call{value: _value}(new bytes(0));
    require(success, "AVAXVaultHandler::safeTransferAVAX: AVAX transfer failed");
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
    return (_interfaceId == _INTERFACE_ID_IVAULT ||
      _interfaceId == _INTERFACE_ID_ERC165);
  }

  /**
   * @notice Returns the Vault information of specified identifier
   * @param _id of vault
   * @return Id, Collateral, Owner, Debt
   */
  function getVault(uint256 _id)
    external
    view
    virtual
    returns (
      uint256,
      uint256,
      address,
      uint256
    )
  {
    Vault memory vault = vaults[_id];
    return (vault.Id, vault.Collateral, vault.Owner, vault.Debt);
  }

  /**
   * @notice Returns the price of the chainlink oracle multiplied by the digits to get 18 decimals format
   * @param _oracle to be the price called
   * @return price
   */
  function getOraclePrice(ChainlinkOracle _oracle)
    public
    view
    virtual
    returns (uint256 price)
  {
    price = _oracle.getLatestAnswer().toUint256().mul(oracleDigits);
  }

  /**
   * @notice Returns the price of the dVIX token
   * @return price of the dVIX Token
   * @dev dVIX token is 18 decimals
   * @dev oracle vixPrice must be in wei format
   * @dev P = V / d
   * P = dVIX Token Price
   * V = VIX price
   * d = Divisor
   */
  function DVIXPrice() public view virtual returns (uint256 price) {
    uint256 vixPrice = getOraclePrice(vixOracle);
    price = vixPrice.div(divisor);
  }

  /**
   * @notice Returns the minimal required collateral to mint dVIX token
   * @param _amount uint amount to mint
   * @return collateral of the dVIX Token
   * @dev dVIX token is 18 decimals
   * @dev C = ((P * A * r) / 100) / cp
   * C = Required Collateral
   * P = dVIX Token Price
   * A = Amount to Mint
   * cp = Collateral Price
   * r = Minimun Ratio for Liquidation
   * It's only divided by 100 as avax price comes in wei to cancel the additional 0s
   */
  function requiredCollateral(uint256 _amount)
    public
    view
    virtual
    returns (uint256 collateral)
  {
    uint256 dvixPrice = DVIXPrice();
    uint256 collateralPrice = getOraclePrice(collateralPriceOracle);
    collateral = ((dvixPrice.mul(_amount).mul(ratio)).div(100)).div(
      collateralPrice
    );
  }

  /**
   * @notice Returns the minimal required dVIX to liquidate a Vault
   * @param _vaultId of the vault to liquidate
   * @return amount required of the dVIX Token
   * @dev LT = ((((D * r) / 100) - cDVIX) * 100) / (r - (p + 100))
   * cDVIX = ((C * cp) / P)
   * LT = Required Liquidation dVIX (i.e. the Liquidation Threshold)
   * D = Vault Debt
   * C = Required Collateral
   * P = dVIX Token Price
   * cp = Collateral Price
   * r = Min Vault Ratio
   * p = Liquidation Penalty
   */
  function requiredLiquidationDVIX(uint256 _vaultId)
    public
    view
    virtual
    returns (uint256 amount)
  {
    Vault memory vault = vaults[_vaultId];
    uint256 dvixPrice = DVIXPrice();
    uint256 collateralPrice = getOraclePrice(collateralPriceOracle);
    uint256 collateralDVIX =
      (vault.Collateral.mul(collateralPrice)).div(dvixPrice);
    uint256 reqDividend =
      (((vault.Debt.mul(ratio)).div(100)).sub(collateralDVIX)).mul(100);
    uint256 reqDivisor = ratio.sub(liquidationPenalty.add(100));
    amount = reqDividend.div(reqDivisor);
  }

  /**
   * @notice Returns the Reward for liquidating a vault
   * @param _vaultId of the vault to liquidate
   * @return rewardCollateral for liquidating Vault
   * @dev the returned value is returned as collateral currency
   * @dev R = (LT * (p  + 100)) / 100
   * R = Liquidation Reward
   * LT = Required Liquidation DVIX
   * p = liquidation penalty
   */
  function liquidationReward(uint256 _vaultId)
    public
    view
    virtual
    returns (uint256 rewardCollateral)
  {
    uint256 req = requiredLiquidationDVIX(_vaultId);
    uint256 dvixPrice = DVIXPrice();
    uint256 collateralPrice = getOraclePrice(collateralPriceOracle);
    uint256 reward = (req.mul(liquidationPenalty.add(100)));
    rewardCollateral = (reward.mul(dvixPrice)).div(collateralPrice.mul(100));
  }

  /**
   * @notice Returns the Collateral Ratio of the Vault
   * @param _vaultId id of vault
   * @return currentRatio
   * @dev vr = (cp * (C * 100)) / D * P
   * vr = Vault Ratio
   * C = Vault Collateral
   * cp = Collateral Price
   * D = Vault Debt
   * P = dVIX Token Price
   */
  function getVaultRatio(uint256 _vaultId)
    public
    view
    virtual
    returns (uint256 currentRatio)
  {
    Vault memory vault = vaults[_vaultId];
    if (vault.Id == 0 || vault.Debt == 0) {
      currentRatio = 0;
    } else {
      uint256 collateralPrice = getOraclePrice(collateralPriceOracle);
      currentRatio = (
        (collateralPrice.mul(vault.Collateral.mul(100))).div(
          vault.Debt.mul(DVIXPrice())
        )
      );
    }
  }

  /**
   * @notice Returns the required fee of AVAX to burn the dVIX tokens
   * @param _amount to burn
   * @return fee
   * @dev The returned value is returned in wei
   * @dev f = (((P * A * b)/ 100))/ AP
   * f = Burn Fee Value
   * P = dVIX Token Price
   * A = Amount to Burn
   * b = Burn Fee %
   * AP = AVAX Price
   */
  function getFee(uint256 _amount) public view virtual returns (uint256 fee) {
    uint256 avaxPrice = getOraclePrice(AVAXPriceOracle);
    fee = (DVIXPrice().mul(_amount).mul(burnFee)).div(100).div(avaxPrice);
  }

  /**
   * @notice Burns an amount of dVIX Tokens
   * @param _vaultId vault id
   * @param _amount to burn
   */
  function _burn(uint256 _vaultId, uint256 _amount) internal {
    Vault storage vault = vaults[_vaultId];
    require(
      vault.Debt >= _amount,
      "VaultHandler::burn: amount greater than debt"
    );
    vault.Debt = vault.Debt.sub(_amount);
    DVIXToken.burn(msg.sender, _amount);
  }
}