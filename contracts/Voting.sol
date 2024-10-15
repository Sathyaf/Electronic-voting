// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        string name;
        string adharNo;
        string phoneNo;
        uint256 age;
        string location;
        bool hasVoted;
        bytes32 voteHash;
    }

    string[] public parties = [
        "ADMK", "DMK", "BJP", "CONGRESS", "TVK", "Nam Tamizhar", "MDMK"
    ];

    mapping(string => Voter) public voters; // Mapping of phone number to Voter
    mapping(string => string) public adharToPhone; // Mapping of Aadhaar number to phone number
    mapping(string => bool) public validParties; // O(1) party validation
    bytes32 public merkleRoot; // Merkle Root for vote verification

    event VoteCast(address indexed voter, string indexed adharNo, string party, bytes32 voteHash);
    event VoterRegistered(string indexed phoneNo, string name);

    modifier onlyRegistered(string memory _phoneNo) {
        require(bytes(voters[_phoneNo].phoneNo).length != 0, "Voter not registered");
        _;
    }

    constructor() Ownable(msg.sender) {
        for (uint i = 0; i < parties.length; i++) {
            validParties[parties[i]] = true;
        }
    }

    // Register a voter with their Aadhaar and phone number
    function registerVoter(
        string memory _name,
        string memory _adharNo,
        string memory _phoneNo,
        uint256 _age,
        string memory _location
    ) public {
        require(bytes(voters[_phoneNo].phoneNo).length == 0, "Voter already registered");
        voters[_phoneNo] = Voter(_name, _adharNo, _phoneNo, _age, _location, false, bytes32(0));
        adharToPhone[_adharNo] = _phoneNo; // Map Aadhaar number to phone number
        emit VoterRegistered(_phoneNo, _name);
    }

    // Retrieve phone number using Aadhaar number
    function getPhoneNumberByAdhar(string memory _adharNo) public view returns (string memory) {
        string memory phoneNo = adharToPhone[_adharNo];
        require(bytes(phoneNo).length > 0, "Phone number not found.");
        return phoneNo;
    }

    // Check if the voter is registered
    function isVoterRegistered(string memory _phoneNo) public view returns (bool) {
        return bytes(voters[_phoneNo].phoneNo).length != 0;
    }

    // Cast vote after verifying Merkle proof
    function castVote(string memory _phoneNo, string memory _party, bytes32[] memory proof) public onlyRegistered(_phoneNo) {
        require(!voters[_phoneNo].hasVoted, "Voter has already voted");
        require(isValidParty(_party), "Invalid party");

        bytes32 leaf = keccak256(abi.encodePacked(_phoneNo, _party));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid Merkle proof");

        voters[_phoneNo].hasVoted = true;
        voters[_phoneNo].voteHash = leaf;

        emit VoteCast(msg.sender, voters[_phoneNo].adharNo, _party, leaf);
    }

    // Set Merkle root for vote verification
    function setMerkleRoot(bytes32 _root) public onlyOwner {
        merkleRoot = _root;
    }
    
    // Check if a party is valid
    function isValidParty(string memory _party) internal view returns (bool) {
        return validParties[_party];
    }
}
