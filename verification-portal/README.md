# TrueCert Verification Portal

A standalone React application for verifying certificates issued through the TrueCert platform. This portal provides a dedicated, streamlined interface for certificate verification without the complexity of the full user portal.

## Features

- **Standalone Verification**: Independent application focused solely on certificate verification
- **Blockchain Integration**: Verifies certificates directly on the Ethereum blockchain
- **IPFS Support**: Retrieves certificate data from IPFS using hash validation
- **Clean UI**: Modern, responsive interface built with Tailwind CSS and Radix UI
- **Fast Performance**: Optimized Vite build for quick loading

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Infura API key for Ethereum Sepolia testnet access

### Installation

1. Clone the repository and navigate to the verification portal:
   ```bash
   cd verification-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```
   VITE_INFURA_URL_SEPOLIA=your_infura_sepolia_url_here
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

1. **Enter IPFS Hash**: Input the 46-character IPFS hash of the certificate
2. **Enter Issuer Address**: Provide the Ethereum address of the issuing organization
3. **Verify**: Click the verification button to check the certificate on the blockchain

The portal will display:
- Certificate validity status
- Complete certificate details (if valid)
- Issuer information
- Issuance timestamp
- Revocation status

## Architecture

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Web3.js for Ethereum interaction
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives

## Deployment

This application can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3**: Upload build files to S3 bucket with static hosting enabled
- **GitHub Pages**: Use GitHub Actions for automated deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_INFURA_URL_SEPOLIA` | Infura endpoint for Sepolia testnet | Yes |

## Support

For issues or questions about the verification portal, please refer to the main TrueCert repository.
