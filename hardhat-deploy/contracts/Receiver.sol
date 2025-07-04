// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";

/**
 * @title Receiver
 * @dev A simple receiver contract for cross-chain messaging
 */
contract Receiver is IMessageRecipient {
    IMailbox public immutable mailbox;
    
    // Events
    event MessageReceived(
        uint32 indexed origin,
        bytes32 indexed sender,
        string message
    );
    
    event MessageProcessed(
        bytes32 indexed messageId,
        uint32 indexed origin,
        bytes32 indexed sender,
        string message
    );

    // Mapping to store received messages
    mapping(bytes32 => string) public receivedMessages;
    mapping(bytes32 => bool) public processedMessages;

    constructor(address _mailbox) {
        mailbox = IMailbox(_mailbox);
    }

    /**
     * @dev Handle incoming cross-chain messages
     * @param _origin The origin domain (chain ID)
     * @param _sender The sender address on the origin chain
     * @param _message The message data
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable override {
        // Only the mailbox can call this function
        require(msg.sender == address(mailbox), "Only mailbox can call");
        
        // Decode the message
        string memory decodedMessage = abi.decode(_message, (string));
        
        // Generate a unique message ID
        bytes32 messageId = keccak256(abi.encodePacked(_origin, _sender, _message));
        
        // Store the message
        receivedMessages[messageId] = decodedMessage;
        processedMessages[messageId] = true;
        
        // Emit events
        emit MessageReceived(_origin, _sender, decodedMessage);
        emit MessageProcessed(messageId, _origin, _sender, decodedMessage);
    }

    /**
     * @dev Get a received message by its ID
     * @param _messageId The message ID
     * @return The message content
     */
    function getMessage(bytes32 _messageId) external view returns (string memory) {
        require(processedMessages[_messageId], "Message not found");
        return receivedMessages[_messageId];
    }

    /**
     * @dev Check if a message has been processed
     * @param _messageId The message ID
     * @return True if the message has been processed
     */
    function isMessageProcessed(bytes32 _messageId) external view returns (bool) {
        return processedMessages[_messageId];
    }
} 