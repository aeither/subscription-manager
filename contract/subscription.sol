// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionContract {
    address public owner;
    mapping(address => uint256) public subscriptions;

    event Subscription(address subscriber, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    function subscribe() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        subscriptions[msg.sender] += msg.value;
        
        emit Subscription(msg.sender, msg.value);
    }

    function getNumberOfSubscribers() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds() external onlyOwner {
        uint256 amount = address(this).balance;
        payable(owner).transfer(amount);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
