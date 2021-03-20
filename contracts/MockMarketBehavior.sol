// SPDX-License-Identifier: MPL-2.0
pragma solidity ^0.5.17;

// this is copied from https://github.com/dev-protocol/github-market/blob/main/contracts/market/GitHubMarket.sol
// modified by taijusanagi

import "./interface/devprotocol/IMarket.sol";

contract MockMarketBehavior {
    function createKey(string memory _repository) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_repository));
    }

    function authenticate(
        address,
        string calldata,
        string calldata,
        string calldata,
        string calldata,
        string calldata,
        address,
        address
    ) external returns (bool) {
        return true;
    }

    function register(
        string memory _repository,
        address _market,
        address _property
    ) private {
        bytes32 key = createKey(_repository);
        IMarket(_market).authenticatedCallback(_property, key);
    }
}
