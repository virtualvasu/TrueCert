/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/EYRFiITV94hgOi9hjRQ14OxPTNPDFgtw", // Replace with your Alchemy URL
      accounts: ["2e33f1db5024aae3edead1e5b1edf6bd8e14937533ec8ea2e980bf8cce28f46a"], // Replace with your private key
    },
  },
};
