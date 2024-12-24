/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "sepolia",
   networks: {
      hardhat: {},
      sepolia: {  // Change 'volta' to 'sepolia'
         url: API_URL,  // Ensure this points to the Sepolia endpoint
         accounts: [`0x${PRIVATE_KEY}`],
         gas: 2100000,  // Adjust gas limit if needed
         gasPrice: 6000000000,  // Adjust gas price if needed
      }
   },
}
