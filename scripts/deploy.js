import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    // Deploy the Voting contract
    const Voting = await ethers.getContractFactory("Voting");
    const votingContract = await Voting.deploy();
    // Log the address of the deployed contract
    console.log("Voting contract deployed to:", votingContract.target);

    // Register Voters
    await votingContract.registerVoter("Sathya", "123456789012", "9843137889", 20, "Coimbatore");
    await votingContract.registerVoter("Harshitha", "123456789013", "7418536190", 25, "Chennai");
    await votingContract.registerVoter("Preeta", "123456789014", "8438054470", 22, "Madurai");

    // Example: Setting Merkle root (this should be calculated based on actual votes)
    const exampleMerkleRoot = ethers.solidityPackedKeccak256(["string"], ["example"]);
    await votingContract.setMerkleRoot(exampleMerkleRoot);
    
    console.log("Voters registered and Merkle root set.");
}

// Execute the main function and catch any errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
