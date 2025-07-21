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
  const [organizationName, setOrganizationName] = useState('');

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
        
        // Fetch organization name using the issuer address
        try {
          const orgName = await contract.methods.getOrgName(certDetails.issuerAddress).call();
          setOrganizationName(orgName);
        } catch (orgError) {
          console.warn('Could not fetch organization name:', orgError);
          setOrganizationName('');
        }
        
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
        setOrganizationName('');
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
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8 border border-purple-100">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
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
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-purple-800">Certificate Details</h3>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              certificateDetails.isRevoked 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {certificateDetails.isRevoked ? '⚠️ Revoked' : '✅ Active'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Recipient's Name</span>
                <p className="text-lg font-medium text-gray-800 mt-1">{certificateDetails.name}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Certificate Title</span>
                <p className="text-lg font-medium text-gray-800 mt-1">{certificateDetails.title}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Issue Date</span>
                <p className="text-lg font-medium text-gray-800 mt-1">{certificateDetails.timeStamp}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {certificateDetails.extra_info && (
                <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Additional Information</span>
                  <p className="text-gray-700 mt-1 leading-relaxed">{certificateDetails.extra_info}</p>
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Issuer Organization</span>
                {organizationName ? (
                  <div className="mt-1">
                    <p className="text-lg font-medium text-gray-800">{organizationName}</p>
                    <p className="text-sm font-mono text-gray-600 mt-1 break-all bg-gray-50 p-2 rounded border">
                      {certificateDetails.issuerAddress}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-mono text-gray-600 mt-1 break-all bg-gray-50 p-2 rounded border">
                    {certificateDetails.issuerAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm font-semibold text-purple-800">Blockchain Verified</span>
            </div>
            <p className="text-sm text-purple-700 mt-2">
              This certificate has been verified on the blockchain and is cryptographically secure.
            </p>
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