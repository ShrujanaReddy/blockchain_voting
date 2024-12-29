const axios = require('axios');
const { ethers } = require('hardhat'); // Correct import of ethers

// Fetch candidates from the API
async function fetchCandidates() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users/approved-candidates');
    // Assuming 'name' is the field you want to use as the candidate name
    return response.data.map(candidate => candidate.name); 
  } catch (error) {
    console.error('Error fetching candidates:', error.message);
    process.exit(1);
  }
}

async function main() {
  // Fetch candidates from the external API
  const candidates = await fetchCandidates();

  if (!candidates || candidates.length === 0) {
    console.error('No candidates found.');
    process.exit(1);
  }

  console.log('Fetched candidates:', candidates);
  const Voting = await ethers.getContractFactory("Voting");
  const Voting_ = await Voting.deploy(candidates, 180);
  console.log("Contract address:", Voting_.address);

  const allCandidates = await Voting_.getAllVotesOfCandiates();
  console.log("Candidates votes:", allCandidates);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error in deployment script:', error.message);
    process.exit(1);
  });
