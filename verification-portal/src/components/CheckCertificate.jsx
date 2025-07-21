import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../assets/contractDetails';
import InputField from './shared/InputField';
import ActionButton from './shared/ActionButton';
import StatusMessage from './shared/StatusMessage';

const CheckCertificate = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [certificateDetails, setCertificateDetails] = useState(null);

  const web3 = new Web3(new Web3.providers.HttpProvider(import.meta.env.VITE_INFURA_URL_SEPOLIA));

  const handleCheckCertificate = async () => {
    try {
      setLoading(true);
      setStatus(null);
      setCertificateDetails(null);

      if (!ipfsHash ) {
        setStatus({ message: 'Please enter a valid IPFS hash.', success: false });
        return;
      }

      if (!issuerAddress || !web3.utils.isAddress(issuerAddress)) {
        setStatus({ message: 'Please enter a valid Ethereum address for the issuer.', success: false });
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const exists = await contract.methods.checkExistence(ipfsHash, issuerAddress).call();

      if (exists) {
        // Fetch certificate details
        const certDetails = await contract.methods.getCertificate(ipfsHash).call();
        
        setCertificateDetails({
          issuerAddress: certDetails.issuerAddress,
          timeStamp: new Date(parseInt(certDetails.timeStamp) * 1000).toLocaleString(),
          isRevoked: certDetails.isRevoked,
          name: certDetails.name,
          title: certDetails.title,
          extra_info: certDetails.extra_info
        });

        setStatus({
          message: certDetails.isRevoked 
            ? 'Certificate exists but has been revoked.' 
            : 'Certificate is valid and exists on the blockchain.',
          success: !certDetails.isRevoked,
        });
      } else {
        setCertificateDetails(null);
        setStatus({
          message: 'Certificate does not exist or is issued by some other organisation.',
          success: false,
        });
      }
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
      
      {certificateDetails && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Certificate Details</h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="font-medium text-gray-700">Certificate Name:</span>
                <p className="text-gray-600 mt-1">{certificateDetails.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Certificate Title:</span>
                <p className="text-gray-600 mt-1">{certificateDetails.title}</p>
              </div>
              {certificateDetails.extra_info && (
                <div>
                  <span className="font-medium text-gray-700">Additional Information:</span>
                  <p className="text-gray-600 mt-1">{certificateDetails.extra_info}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Issuer Address:</span>
                <p className="text-gray-600 mt-1 break-all">{certificateDetails.issuerAddress}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Issue Date:</span>
                <p className="text-gray-600 mt-1">{certificateDetails.timeStamp}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className={`mt-1 font-medium ${certificateDetails.isRevoked ? 'text-red-600' : 'text-green-600'}`}>
                  {certificateDetails.isRevoked ? 'Revoked' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-600 text-sm mt-4 text-center">
        Enter the details carefully. Ensure you have an Ethereum node accessible.
      </p>
    </div>
  );
};

export default CheckCertificate;