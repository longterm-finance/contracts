// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract TreasuryVester {
  using SafeMath for uint256;

  address public avix;
  address public recipient;

  uint256 public vestingAmount;
  uint256 public vestingBegin;
  uint256 public vestingCliff;
  uint256 public vestingEnd;

  uint256 public lastUpdate;

  constructor(
    address avix_,
    address recipient_,
    uint256 vestingAmount_,
    uint256 vestingBegin_,
    uint256 vestingCliff_,
    uint256 vestingEnd_
  ) {
    require(
      vestingBegin_ >= block.timestamp,
      "TreasuryVester::constructor: vesting begin too early"
    );
    require(
      vestingCliff_ >= vestingBegin_,
      "TreasuryVester::constructor: vesting cliff is too early"
    );
    require(
      vestingEnd_ > vestingCliff_,
      "TreasuryVester::constructor: vesting end is too early"
    );

    avix = avix_;
    recipient = recipient_;

    vestingAmount = vestingAmount_;
    vestingBegin = vestingBegin_;
    vestingCliff = vestingCliff_;
    vestingEnd = vestingEnd_;

    lastUpdate = vestingBegin;
  }

  function setRecipient(address recipient_) public {
    require(
      msg.sender == recipient,
      "TreasuryVester::setRecipient: unauthorized"
    );
    recipient = recipient_;
  }

  function claim() public {
    require(
      block.timestamp >= vestingCliff,
      "TreasuryVester::claim: not time yet"
    );
    uint256 amount;
    if (block.timestamp >= vestingEnd) {
      amount = IAvix(avix).balanceOf(address(this));
    } else {
      amount = vestingAmount.mul(block.timestamp - lastUpdate).div(
        vestingEnd - vestingBegin
      );
      lastUpdate = block.timestamp;
    }
    IAvix(avix).transfer(recipient, amount);
  }
}

interface IAvix {
  function balanceOf(address account) external view returns (uint256);

  function transfer(address dst, uint256 rawAmount) external returns (bool);
}