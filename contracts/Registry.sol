// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract Registry {
    mapping(address => uint256) public scores;
    address public admin;
    constructor() { admin = msg.sender; }
    function record(address a, uint256 s, uint256 t) external {
        require(msg.sender == admin);
        scores[a] = s;
        emit Analyzed(a, s, t, block.timestamp);
    }
    event Analyzed(address indexed wallet, uint256 score, uint256 txCount, uint256 ts);
}
