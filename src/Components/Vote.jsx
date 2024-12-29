import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../Constant/constant";
import Login from "./Login";
import Finished from "./Finished";
import Connected from "./Connected";

function Vote() {
//     const [provider, setProvider] = useState(null);
//     const [account, setAccount] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [votingStatus, setVotingStatus] = useState(true);
//     const [remainingTime, setRemainingTime] = useState('');
//     const [candidates, setCandidates] = useState([]);
//     const [number, setNumber] = useState('');
//     const [canVoteStatus, setCanVoteStatus] = useState(true); // Renamed state variable

//     useEffect(() => {
//         fetchCandidates();
//         fetchRemainingTime();
//         fetchVotingStatus();
//         fetchCanVoteStatus(); // Fetch initial voting status
//         if (window.ethereum) {
//             window.ethereum.on('accountsChanged', handleAccountsChanged);
//         }

//         return () => {
//             if (window.ethereum) {
//                 window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//             }
//         };
//     }, []);

//     async function vote() {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         await provider.send("eth_requestAccounts", []);
//         const signer = provider.getSigner();
//         const contractInstance = new ethers.Contract(
//             contractAddress, contractAbi, signer
//         );

//         const tx = await contractInstance.vote(number);
//         await tx.wait();
//         await fetchCanVoteStatus(); // Update voting status after voting
//     }

//     async function fetchCanVoteStatus() {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             const contractInstance = new ethers.Contract(
//                 contractAddress, contractAbi, signer
//             );
//             const voteStatus = await contractInstance.voters(signerAddress);
//             setCanVoteStatus(voteStatus);
//         } catch (error) {
//             console.error("Error fetching vote status:", error);
//         }
//     }

//     async function fetchCandidates() {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();
//             const contractInstance = new ethers.Contract(
//                 contractAddress, contractAbi, signer
//             );
//             const candidatesList = await contractInstance.getAllVotesOfCandidates();
//             const formattedCandidates = candidatesList.map((candidate, index) => ({
//                 index: index,
//                 name: candidate.name,
//                 voteCount: candidate.voteCount.toNumber()
//             }));
//             setCandidates(formattedCandidates);
//         } catch (error) {
//             console.error("Error fetching candidates:", error);
//         }
//     }

//     async function fetchVotingStatus() {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();
//             const contractInstance = new ethers.Contract(
//                 contractAddress, contractAbi, signer
//             );
//             const status = await contractInstance.getVotingStatus();
//             console.log("Voting status:", status);
//             setVotingStatus(status);
//         } catch (error) {
//             console.error("Error fetching voting status:", error);
//         }
//     }

//     async function fetchRemainingTime() {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       const contractInstance = new ethers.Contract (
//         contractAddress, contractAbi, signer
//       );
//       const time = await contractInstance.getRemainingTime();
//       setRemainingTime(parseInt(time, 16));
//   }

//     function handleAccountsChanged(accounts) {
//         if (accounts.length > 0 && account !== accounts[0]) {
//             setAccount(accounts[0]);
//             fetchCanVoteStatus();
//         } else {
//             setIsConnected(false);
//             setAccount(null);
//         }
//     }

//     async function connectToMetamask() {
//         if (window.ethereum) {
//             try {
//                 const provider = new ethers.providers.Web3Provider(window.ethereum);
//                 setProvider(provider);
//                 await provider.send("eth_requestAccounts", []);
//                 const signer = provider.getSigner();
//                 const address = await signer.getAddress();
//                 setAccount(address);
//                 console.log("Metamask Connected:", address);
//                 setIsConnected(true);
//                 fetchCanVoteStatus();
//             } catch (err) {
//                 console.error("Error connecting to MetaMask:", err);
//             }
//         } else {
//             console.error("Metamask not detected in the browser.");
//         }
//     }

//     function handleNumberChange(e) {
//         setNumber(e.target.value);
//     }

//     return (
//         <div>
//             {votingStatus ? (
//                 isConnected ? (
//                     <Connected
//                         account={account}
//                         candidates={candidates}
//                         remainingTime={remainingTime}
//                         number={number}
//                         handleNumberChange={handleNumberChange}
//                         voteFunction={vote}
//                         showButton={canVoteStatus}
//                     />
//                 ) : (
//                     <Login connectWallet={connectToMetamask} />
//                 )
//             ) : (
//                 <Finished />
//             )}
//         </div>
//     );
// }
const [provider, setProvider] = useState(null);
const [account, setAccount] = useState(null);
const [isConnected, setIsConnected] = useState(false);
const [votingStatus, setVotingStatus] = useState(true);
const [remainingTime, setRemainingTime] = useState('');
const [candidates, setCandidates] = useState([]);
const [number, setNumber] = useState('');
const [CanVote, setCanVote] = useState(true);

useEffect(() => {
  const initialize = async () => {
    await getCandidates();
    await getRemainingTime();
    await getCurrentStatus();
  };

  initialize();

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };
}, []); // Empty dependency array

async function vote() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );

    try {
      const tx = await contractInstance.vote(number);
      await tx.wait();
      await canVote(); // Check voting status after voting
    } catch (error) {
      console.error("Vote error:", error);
    }
  }
}

async function canVote() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }
//   try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();
//             const signerAddress = await signer.getAddress();
//             const contractInstance = new ethers.Contract(
//                 contractAddress, contractAbi, signer
//             );
//             const voteStatus = await contractInstance.voters(signerAddress);
//             setCanVoteStatus(voteStatus);
//         } catch (error) {
//             console.error("Error fetching vote status:", error);
//         }
}

async function getCandidates() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => ({
      index: index,
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber()
    }));
    setCandidates(formattedCandidates);
  }
}

async function getCurrentStatus() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
    await canVote(); // Check voting status after getting the general status
  }
}

async function getRemainingTime() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time._hex, 16)); // Ensure proper parsing
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length > 0 && account !== accounts[0]) {
    setAccount(accounts[0]); // Correctly set the new account
    setIsConnected(true);
    canVote();
  } else {
    setIsConnected(false);
    setAccount(null);
    setCanVote(true); // Reset voting status
  }
}

async function connectToMetamask() {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      console.log("Metamask Connected :", address);
      setIsConnected(true);
      canVote();
    } catch (err) {
      console.error("Connect error:", err);
    }
  } else {
    console.error("Metamask not detected");
  }
}

function handleNumberChange(e) {
  setNumber(e.target.value);
}

return (
  <div className="App">
    { 
      votingStatus 
        ? (isConnected 
            ? (<Connected 
                account={account}
                candidates={candidates}
                remainingTime={remainingTime}
                number={number}
                handleNumberChange={handleNumberChange}
                voteFunction={vote}
                showButton={true}
                />)
            : (<Login connectWallet={connectToMetamask}/>))
        : (<Finished />)
    }
  </div>
);

}

export default Vote;