
const abi = [
    "function getPhoneNumberByAdhar(string memory _adharNo) public view returns (string memory)",
    "function castVote(string memory _phoneNo, string memory _party, bytes32[] memory proof) public",
    "function isVoterRegistered(string memory _phoneNo) public view returns (bool)"
];

let provider;
let signer;
let votingContract;
let generatedOTP;
let leaves = []; // Array to hold the leaves for the Merkle tree

// Initialize the contract
async function init() {
    try {
        provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); // Use the correct provider for your network
        signer = provider.getSigner(); // Connect to the signer (wallet)

        const contractAddress = "0xAAa66dfA30F3A43ed3395e23119d73521E1f7a51"; // Replace with your contract address
        votingContract = new ethers.Contract(contractAddress, abi, signer); // Connect contract to signer
    } catch (error) {
        console.error("Error initializing contract:", error);
    }
}

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get OTP and phone number
async function getOTP() {
    const adharNo = document.getElementById("adharNo").value.trim();

    try {
        const phoneNo = await votingContract.getPhoneNumberByAdhar(adharNo);
        const isRegistered = await votingContract.isVoterRegistered(phoneNo);

        if (!isRegistered) {
            alert("Phone number not registered.");
            return;
        }

        generatedOTP = generateOTP();
        console.log("Generated OTP:", generatedOTP);
        alert("OTP sent to your phone! (Check the console for the OTP)");

        document.getElementById("otp").style.display = "block";
        document.getElementById("loginButton").style.display = "block";
    } catch (error) {
        console.error("Error getting phone number:", error);
    }
}

// Login with OTP
function login() {
    const enteredOTP = document.getElementById("otp").value;

    if (enteredOTP === generatedOTP) {
        alert("OTP verified! You can now cast your vote.");
        document.getElementById("voting").style.display = "block";
        document.getElementById("login").style.display = "none";
    } else {
        alert("Invalid OTP! Please try again.");
    }
}

// Function to generate Merkle proof
async function generateProof(phoneNo, party) {
    const leaf = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ['string', 'string'],
        [phoneNo, party]
    ));

    // Create the Merkle tree
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, { sort: true });

    // Generate proof for the leaf
    const proof = tree.getProof(leaf).map(p => p.data);
    
    return proof;
}

// Cast vote function
async function castVote() {
    const adharNo = document.getElementById("adharNo").value.trim();
    const selectedParty = document.getElementById("partySelect").value;

    if (!selectedParty) {
        alert("Please select a party.");
        return;
    }

    const phoneNo = await votingContract.getPhoneNumberByAdhar(adharNo);
    
    // Add to leaves for proof generation
    const leaf = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string', 'string'], [phoneNo, selectedParty]));
    leaves.push(leaf); // Push leaf to leaves array

    const proof = await generateProof(phoneNo, selectedParty); // Generate proof

    try {
        const tx = await votingContract.castVote(phoneNo, selectedParty, proof);
        await tx.wait();
        alert("Vote cast successfully!");
    } catch (error) {
        console.error("Error casting vote:", error);
    }
}

// Event Listeners
document.getElementById("getOTP").addEventListener("click", getOTP);
document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("castVote").addEventListener("click", castVote);

// Initialize contract on page load
window.onload = init;
