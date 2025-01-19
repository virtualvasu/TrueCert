import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../../../assets/contractDetails';
import InputField from '../components/shared/InputField';
import ActionButton from '../components/shared/ActionButton';
import StatusMessage from '../components/shared/StatusMessage';

const CheckCertificate = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const web3 = new Web3(new Web3.providers.HttpProvider(import.meta.env.VITE_INFURA_URL_SEPOLIA));

  const handleCheckCertificate = async () => {
    try {
      setLoading(true);
      setStatus(null);

      if (!ipfsHash || !/^[a-zA-Z0-9]{46}$/.test(ipfsHash)) {
        setStatus({ message: 'Please enter a valid IPFS hash.', success: false });
        return;
      }

      if (!issuerAddress || !web3.utils.isAddress(issuerAddress)) {
        setStatus({ message: 'Please enter a valid Ethereum address for the issuer.', success: false });
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const exists = await contract.methods.checkExistence(ipfsHash, issuerAddress).call();

      setStatus({
        message: exists
          ? 'Certificate exists on the blockchain.'
          : 'Certificate does not exist or is issued by some other organisation.',
        success: exists,
      });
    } catch (error) {
      console.error('Error:', error.message);
      setStatus({ message: `Error: ${error.message}`, success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Verify Certificate
      </h2>
      <div className="space-y-4">
        <InputField
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          placeholder="Enter IPFS Hash"
          isValid={/^[a-zA-Z0-9]{46}$/.test(ipfsHash)}
        />
        <InputField
          value={issuerAddress}
          onChange={(e) => setIssuerAddress(e.target.value)}
          placeholder="Enter Issuer Organization Address"
          isValid={web3.utils.isAddress(issuerAddress)}
        />
        <ActionButton onClick={handleCheckCertificate} loading={loading} disabled={loading}>
          Check Certificate
        </ActionButton>
      </div>
      {status && <StatusMessage message={status.message} success={status.success} />}
      <p className="text-gray-600 text-sm mt-4 text-center">
        Enter the details carefully. Ensure you have an Ethereum node accessible.
      </p>
    </div>
  );
};

export default CheckCertificate;
