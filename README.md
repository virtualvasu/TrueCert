# TrueCert

A blockchain-based certificate verification platform that enables secure issuance, storage, and verification of digital certificates using Ethereum smart contracts and IPFS.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Reference](#api-reference)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

TrueCert is a decentralized platform for issuing and verifying digital certificates. By leveraging blockchain technology, we ensure that certificates are tamper-proof, permanently stored, and easily verifiable by anyone.

### Key Features
- 🔐 **Immutable Certificates**: Blockchain-based certificate storage ensuring tamper-proof records
- 🌐 **Decentralized Storage**: IPFS integration for secure document storage
- 📧 **Email Notifications**: Automated certificate delivery via email
- 🦄 **Web3 Integration**: MetaMask support for seamless blockchain interactions
- ✅ **Certificate Verification**: Public verification system for issued certificates

## Architecture

TrueCert follows a three-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Ethereum)    │
│                 │    │                 │    │                 │
│ • User Interface│    │ • API Gateway   │    │ • Smart Contract│
│ • Web3 Integration│   │ • Email Service │    │ • IPFS Storage  │
│ • Certificate UI│    │ • File Handling │    │ • Certificate DB│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

Before setting up TrueCert, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**
- **MetaMask** browser extension
- **Ethereum wallet** with Sepolia testnet ETH

### Required Accounts
- [Pinata](https://pinata.cloud/) account for IPFS storage
- [Brevo](https://brevo.com/) account for email services
- [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/) account for Ethereum RPC

## Quick Start

```bash
# Clone the repository
git clone https://github.com/virtualvasu/TrueCert.git
cd TrueCert

# Install dependencies for all components
npm run install:all

# Set up environment variables (see Configuration section)
cp server/.env.sample server/.env
cp client/.env.sample client/.env
cp hardhat/.env.sample hardhat/.env

# Deploy smart contracts
cd hardhat
npx hardhat ignition deploy deployments/ --network sepolia

# Start the development environment
npm run dev
```

## Project Structure

```
TrueCert/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/styling files
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Backend Node.js server
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   ├── utils/              # Server utilities
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
├── hardhat/                # Smart contract development
│   ├── contracts/          # Solidity smart contracts
│   ├── deployments/        # Ignition deployment modules
│   ├── test/               # Contract tests
│   └── hardhat.config.js   # Hardhat configuration
└── docs/                   # Documentation files
```

## Installation & Setup

### 1. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create and configure your environment file:

```bash
cp .env.sample .env
```

Configure the following environment variables in `server/.env`:

```env
# IPFS Configuration
PINATA_JWT_TOKEN=your_pinata_jwt_token

# Email Configuration
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_AUTH_USER=your_brevo_username
BREVO_AUTH_PASS=your_brevo_password
SENDER_EMAIL=your_sender_email@domain.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

Start the server:

```bash
npm start
```

The server will be available at `http://localhost:3000`

### 2. Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Configure your environment variables in `client/.env`:

```env
# Smart Contract Configuration
VITE_ADMIN_PUBLIC_ADDRESS=0xYourContractDeployerAddress

# Server Configuration
VITE_SERVER_URL=http://localhost:3000

# Blockchain Configuration
VITE_INFURA_URL_SEPOLIA=https://sepolia.infura.io/v3/your_project_id

# Email Configuration
VITE_RECEIVER_EMAIL=notifications@yourdomain.com
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Smart Contract Setup

Navigate to the hardhat directory and install dependencies:

```bash
cd hardhat
npm install
```

Configure your environment variables in `hardhat/.env`:

```env
# Network Configuration
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
PRIVATE_KEY=your_wallet_private_key

# Contract Configuration
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Deploy the smart contracts:

```bash
npx hardhat ignition deploy deployments/ --network sepolia
```

## API Reference

### Authentication
All API endpoints require proper authentication headers where applicable.

### Endpoints

#### Certificate Registration
```http
POST /registration/fromissuer
```

Register a new certificate request from an issuer.

**Request Body:**
```json
{
  "issuerName": "University Name",
  "issuerEmail": "issuer@university.edu",
  "recipientName": "John Doe",
  "recipientEmail": "john@example.com",
  "certificateTitle": "Bachelor of Science",
  "certificateHash": "0x...",
  "metadata": {
    "graduationDate": "2024-05-15",
    "courseDetails": "Computer Science"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate registration successful",
  "registrationId": "cert_12345"
}
```

#### Certificate Issuance
```http
POST /certificates/issue
```

Issue a certificate and send notification email.

**Request Body:**
```json
{
  "certificateId": "cert_12345",
  "recipientEmail": "john@example.com",
  "certificateMetadata": {
    "tokenId": 1,
    "ipfsHash": "QmX...",
    "transactionHash": "0x..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Certificate issued successfully",
  "certificateUrl": "https://truecert.com/verify/cert_12345"
}
```

### Error Handling

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": "The provided email address is not valid"
  }
}
```

## Smart Contract Deployment

### Network Configuration

The project supports multiple Ethereum networks. Update `hardhat.config.js` for additional networks:

```javascript
module.exports = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### Deployment Commands

```bash
# Deploy to Sepolia testnet
npx hardhat ignition deploy deployments/ --network sepolia

# Deploy to mainnet (ensure sufficient ETH balance)
npx hardhat ignition deploy deployments/ --network mainnet

# Verify contracts on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Post-Deployment

After successful deployment:

1. Update the `VITE_ADMIN_PUBLIC_ADDRESS` in client environment
2. Save contract addresses for frontend integration
3. Verify contracts on Etherscan for transparency

## Configuration

### Environment Variables Reference

#### Server Configuration
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PINATA_JWT_TOKEN` | Pinata API JWT token | Yes | - |
| `BREVO_HOST` | Brevo SMTP host | Yes | smtp-relay.brevo.com |
| `BREVO_PORT` | Brevo SMTP port | Yes | 587 |
| `BREVO_AUTH_USER` | Brevo username | Yes | - |
| `BREVO_AUTH_PASS` | Brevo password | Yes | - |
| `SENDER_EMAIL` | Sender email address | Yes | - |
| `PORT` | Server port | No | 3000 |

#### Client Configuration
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ADMIN_PUBLIC_ADDRESS` | Contract deployer address | Yes |
| `VITE_SERVER_URL` | Backend server URL | Yes |
| `VITE_INFURA_URL_SEPOLIA` | Infura Sepolia endpoint | Yes |
| `VITE_RECEIVER_EMAIL` | Notification email | Yes |

## Testing

### API Testing

Test the API endpoints using the following tools:

**Using cURL:**
```bash
curl -X POST http://localhost:3000/registration/fromissuer \
  -H "Content-Type: application/json" \
  -d '{
    "issuerName": "Test University",
    "recipientEmail": "test@example.com"
  }'
```

**Using Postman:**
Import the provided Postman collection from `/docs/postman/TrueCert-API.json`

### Smart Contract Testing

Run the contract test suite:

```bash
cd hardhat
npx hardhat test
```

### Frontend Testing

Run frontend unit tests:

```bash
cd client
npm run test
```

## Troubleshooting

### Common Issues

#### Server Won't Start
- **Issue**: `Error: Cannot find module`
- **Solution**: Run `npm install` in the server directory

#### Smart Contract Deployment Fails
- **Issue**: `Error: insufficient funds for gas`
- **Solution**: Ensure your wallet has enough Sepolia ETH

#### Frontend Can't Connect to MetaMask
- **Issue**: MetaMask not detected
- **Solution**: Install MetaMask extension and refresh the page

#### IPFS Upload Fails
- **Issue**: Pinata authentication error
- **Solution**: Verify your `PINATA_JWT_TOKEN` is correct and active

### Debug Mode

Enable debug mode by setting environment variables:

```bash
# Server debug mode
DEBUG=truecert:* npm start

# Client debug mode
VITE_DEBUG=true npm run dev
```

## Contributing

We welcome contributions to TrueCert! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ by @virtualvasu