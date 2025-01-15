# TrueCert

TrueCert is a decentralized certificate issuing and verification service that leverages blockchain technology to ensure the authenticity and security of digital credentials. By eliminating the challenges associated with traditional certificate systems, TrueCert provides a reliable solution for organizations and individuals alike.

## Features

- **Blockchain-Based Certificate Storage**: Certificates are securely stored on a blockchain, ensuring accessibility and immutability.
- **Smart Contract-Driven Data Integrity**: Changes to certificate data are logged as new states, preventing tampering.
- **Seamless Verification**: Verification is simplified through direct interaction with smart contracts, reducing the need for intermediaries.

## Tech Stack

TrueCert is built using the following technologies:

- **Blockchain and Smart Contracts**:
  - **Ethereum Blockchain**: Provides secure and transparent data storage.
  - **Solidity**: The programming language for our smart contracts.

- **Decentralized Storage**:
  - **Pinata (IPFS)**: Decentralized storage for safe and reliable certificate data.

- **Frontend**:
  - **React.js**: A user-friendly interface for both organizations and individuals.

- **Backend**:
  - **Express.js**: Connects the frontend to the blockchain and handles user requests.

- **Wallet Integration**:
  - **MetaMask**: Allows users to connect their wallets and interact with the blockchain.

- **Development and Deployment Tools**:
  - **Hardhat**: A toolkit for writing, testing, and deploying smart contracts.
  - **Infura**: Provides access to the Ethereum blockchain without running a full node.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/virtualvasu/TrueCert.git
   ```

2. Navigate to the project directory:
   ```bash
   cd TrueCert
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Follow the setup instructions for the smart contracts and frontend.

For more info about this project, refer this article on Medium: https://medium.com/@virtualvasu/truecert-a-decentralized-certificate-issuing-and-verification-service-fcb346ae24a4