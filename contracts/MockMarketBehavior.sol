// SPDX-License-Identifier: MPL-2.0
pragma solidity ^0.5.17;

// this is copied from https://github.com/dev-protocol/github-market/blob/main/contracts/market/GitHubMarket.sol
// modified by taijusanagi

// import "hardhat/console.sol";

interface IMarketBehavior {
    function authenticate(
        address _prop,
        string calldata _args1,
        string calldata _args2,
        string calldata _args3,
        string calldata _args4,
        string calldata _args5,
        address _market,
        address _account
    ) external returns (bool);

    function schema() external view returns (string memory);

    function getId(address _metrics) external view returns (string memory);

    function getMetrics(string calldata _id) external view returns (address);
}

contract MockMarketBehavior is IMarketBehavior {
    mapping(bytes32 => address) private metrics;
    mapping(bytes32 => address) private properties;
    mapping(bytes32 => address) private markets;
    mapping(bytes32 => bool) private pendingAuthentication;
    mapping(string => bool) private publicSignatures;

    function createKey(string memory _repository) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_repository));
    }

    function authenticate(
        address _prop,
        string calldata _createrRepository,
        string calldata,
        string calldata,
        string calldata,
        string calldata,
        address _market,
        address
    ) external returns (bool) {
        // console.log("behavior: authenticate called");
        bytes32 key = createKey(_createrRepository);
        properties[key] = _prop;
        markets[key] = _market;
        pendingAuthentication[key] = true;
        return true;
    }

    function schema() external view returns (string memory) {
        // TODO: implement later
        // console.log("behavior: schema called");
        return "";
    }

    function getId(address _metrics) external view returns (string memory) {
        // TODO: implement later
        // console.log("getId: schema called", _metrics);
        return "";
    }

    function getMetrics(string calldata _id) external view returns (address) {
        // console.log("getMetrics: schema called", _id);
        return metrics[createKey(_id)];
    }
}
