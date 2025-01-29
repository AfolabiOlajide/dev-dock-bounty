// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CreatorTipping
 * @dev Contract for tipping content creators with ETH
 */
contract CreatorTipping {
    // Structure to store creator information
    struct Creator {
        address payable walletAddress;
        uint256 totalTips;
        bool isRegistered;
    }

    // Mapping to store creator information
    mapping(address => Creator) public creators;
    
    // Array to keep track of all registered creators
    address[] public creatorAddresses;

    // Events
    event CreatorRegistered(address indexed creatorAddress);
    event TipSent(address indexed from, address indexed to, uint256 amount);
    event CreatorWithdraw(address indexed creator, uint256 amount);

    /**
     * @dev Register as a content creator
     */
    function registerCreator() external {
        require(!creators[msg.sender].isRegistered, "Creator already registered");
        
        creators[msg.sender] = Creator({
            walletAddress: payable(msg.sender),
            totalTips: 0,
            isRegistered: true
        });
        
        creatorAddresses.push(msg.sender);
        
        emit CreatorRegistered(msg.sender);
    }

    /**
     * @dev Send tip to a creator
     * @param _creator Address of the creator to tip
     */
    function tipCreator(address _creator) external payable {
        require(creators[_creator].isRegistered, "Creator not registered");
        require(msg.value > 0, "Tip amount must be greater than 0");

        creators[_creator].totalTips += msg.value;
        
        emit TipSent(msg.sender, _creator, msg.value);
    }

    /**
     * @dev Creator withdraws their accumulated tips
     */
    function withdrawTips() external {
        require(creators[msg.sender].isRegistered, "Only registered creators can withdraw");
        require(creators[msg.sender].totalTips > 0, "No tips available to withdraw");

        uint256 amount = creators[msg.sender].totalTips;
        creators[msg.sender].totalTips = 0;

        (bool success, ) = creators[msg.sender].walletAddress.call{value: amount}("");
        require(success, "Transfer failed");

        emit CreatorWithdraw(msg.sender, amount);
    }

    /**
     * @dev Get creator's total tips
     * @param _creator Address of the creator
     * @return uint256 Total tips received by creator
     */
    function getCreatorTips(address _creator) external view returns (uint256) {
        require(creators[_creator].isRegistered, "Creator not registered");
        return creators[_creator].totalTips;
    }

    /**
     * @dev Get all registered creators
     * @return address[] Array of creator addresses
     */
    function getAllCreators() external view returns (address[] memory) {
        return creatorAddresses;
    }

    /**
     * @dev Check if an address is a registered creator
     * @param _address Address to check
     * @return bool True if address is a registered creator
     */
    function isCreator(address _address) external view returns (bool) {
        return creators[_address].isRegistered;
    }
}