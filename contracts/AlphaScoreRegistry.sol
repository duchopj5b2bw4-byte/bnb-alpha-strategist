// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AlphaScoreRegistry {
    address public admin;
    uint256 public total;

    struct Analysis { address wallet; uint256 score; uint256 txCount; uint256 ts; }
    Analysis[] public all;
    mapping(address => Analysis[]) public history;

    event Analyzed(address indexed wallet, uint256 score, uint256 ts);

    constructor() { admin = msg.sender; }

    function record(address _w, uint256 _s, uint256 _tx, string calldata) external returns (uint256) {
        require(msg.sender == admin);
        Analysis memory a = Analysis(_w, _s, _tx, block.timestamp);
        all.push(a); history[_w].push(a); total++;
        emit Analyzed(_w, _s, block.timestamp);
        return total;
    }

    function latest(address _w) external view returns (uint256 score, uint256 txCount, uint256 ts) {
        Analysis[] storage h = history[_w];
        if (h.length == 0) return (0,0,0);
        Analysis storage a = h[h.length-1];
        return (a.score, a.txCount, a.ts);
    }

    function recent(uint256 limit) external view returns (Analysis[] memory) {
        uint256 n = all.length;
        uint256 take = limit < n ? limit : n;
        Analysis[] memory r = new Analysis[](take);
        for (uint256 i = 0; i < take; i++) r[i] = all[n-1-i];
        return r;
    }
}
