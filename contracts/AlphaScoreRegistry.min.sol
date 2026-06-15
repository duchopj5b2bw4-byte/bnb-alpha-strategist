// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract AlphaScoreRegistry {
    address public admin;
    mapping(address => uint256) public scores;
    event Analyzed(address indexed wallet, uint256 score, uint256 txCount, uint256 ts);
    constructor() { admin = msg.sender; }
    function record(address w, uint256 s, uint256 txC) external {
        require(msg.sender == admin);
        scores[w] = s;
        emit Analyzed(w, s, txC, block.timestamp);
    }
}
