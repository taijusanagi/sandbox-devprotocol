// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.5.17;

// this is copied from https://github.com/dev-protocol/protocol/blob/main/contracts/interface/IMarketFactory.sol

interface IMarketFactory {
    function create(address _addr) external returns (address);
}
