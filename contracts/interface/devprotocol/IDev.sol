// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.5.17;

// this is copied from https://github.com/dev-protocol/protocol/blob/main/contracts/interface/IDev.sol

interface IDev {
    function deposit(address _to, uint256 _amount) external returns (bool);

    function depositFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);

    function fee(address _from, uint256 _amount) external returns (bool);
}
