// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentIdentity {
    address public admin;
    uint256 public agentCount;
    uint256 public analysisCount;

    event AgentRegistered(uint256 indexed id, string name, address indexed owner);
    event AnalysisLogged(uint256 indexed id, string txHash, uint256 riskScore);

    constructor() {
        admin = msg.sender;
    }

    function registerAgent(string calldata _name, string calldata _description) external returns (uint256) {
        agentCount++;
        emit AgentRegistered(agentCount, _name, msg.sender);
        return agentCount;
    }

    function logAnalysis(string calldata _txHash, string calldata _summary, uint256 _riskScore) external returns (uint256) {
        analysisCount++;
        emit AnalysisLogged(analysisCount, _txHash, _riskScore);
        return analysisCount;
    }
}
