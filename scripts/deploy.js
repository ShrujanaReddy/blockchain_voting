async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  // Start deployment, returning a promise that resolves to a contract object
  const Voting_ = await Voting.deploy(["A", "C", "B", "D"], 90);
  console.log("Contract address:", Voting_.address);

  const allCandidates = await Voting_.getAllVotesOfCandiates();
  console.log("Candidates votes:", allCandidates);

  const candidates = await Voting_.getAllVotesOfCandiates();
  console.log("Candidates:", candidates);

}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });