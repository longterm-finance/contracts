// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface CustomOraclnterface {
  function requestPriceData() external returns (bytes32 requestId); 

  function fulfill(bytes32 _requestId, uint256 _price) external;

  function returnPrice() external view returns (uint256);

  function withdrawLink() external;
}
