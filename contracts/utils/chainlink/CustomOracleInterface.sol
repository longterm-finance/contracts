// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface CustomOracleInterface {
  function requestPriceData() external returns (bytes32);

  function fulfill(bytes32 _requestId, uint256 _price) external;

  function returnPrice() external returns (uint256);

  function withdrawLink() external;
}


