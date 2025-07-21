import React, { useState, useEffect } from 'react';
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
  const [showSuccessPopover, setShowSuccessPopover] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const web3 = new Web3(new Web3.providers.HttpProvider(import.meta.env.VITE_INFURA_URL_SEPOLIA));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCertificateImageUrl = (cid) => {
    return `https://copper-adjacent-earthworm-299.mypinata.cloud/ipfs/${cid}`;
  };

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

        if (!certDetails.isRevoked) {
          setShowSuccessPopover(true);
          setTimeout(() => setShowSuccessPopover(false), 4000);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Success Popover */}
      {showSuccessPopover && (
        <div className="fixed top-20 right-8 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl border border-green-400">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold">✓</span>
              </div>
              <span className="font-semibold">Certificate Verified Successfully!</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              TrueCert
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Verification
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Decentralized certificate verification powered by blockchain technology. 
              Tamper-proof, transparent, and completely trustless.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="space-y-6">
              <InputField
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
                placeholder="Enter IPFS Hash (CID)"
                isValid={/^[a-zA-Z0-9]{46}$/.test(ipfsHash)}
              />
              <InputField
                value={issuerAddress}
                onChange={(e) => setIssuerAddress(e.target.value)}
                placeholder="Enter Issuer Organization Address"
                isValid={web3.utils.isAddress(issuerAddress)}
              />
              <ActionButton onClick={handleCheckCertificate} loading={loading} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Certificate'}
              </ActionButton>
            </div>
            
            {status && (
              <div className="mt-6">
                <StatusMessage message={status.message} success={status.success} />
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Scroll down to explore verification details</p>
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Display Section */}
      {certificateDetails && (
        <>
          {/* Certificate Image Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Certificate Preview
                </h2>
                <p className="text-slate-300 text-lg">
                  View the actual certificate document stored on IPFS
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-inner">
                  <img 
                    src={getCertificateImageUrl(ipfsHash)}
                    alt="Certificate"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center flex-col text-slate-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-center">Certificate document unavailable</p>
                    <p className="text-sm text-slate-500 mt-2">IPFS: {ipfsHash}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Certificate Details Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Certificate Details
                  </h2>
                  <div className={`ml-6 px-6 py-3 rounded-full text-lg font-semibold ${
                    certificateDetails.isRevoked 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                      : 'bg-green-500/20 text-green-300 border border-green-500/50'
                  }`}>
                    {certificateDetails.isRevoked ? '⚠️ Revoked' : '✅ Verified'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                    <span className="text-purple-300 font-semibold uppercase tracking-wide text-sm">Recipient</span>
                    <p className="text-2xl font-bold text-white mt-2">{certificateDetails.name}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                    <span className="text-purple-300 font-semibold uppercase tracking-wide text-sm">Certificate Title</span>
                    <p className="text-2xl font-bold text-white mt-2">{certificateDetails.title}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                    <span className="text-purple-300 font-semibold uppercase tracking-wide text-sm">Issue Date</span>
                    <p className="text-xl text-slate-300 mt-2">{certificateDetails.timeStamp}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {certificateDetails.extra_info && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                      <span className="text-purple-300 font-semibold uppercase tracking-wide text-sm">Additional Information</span>
                      <p className="text-slate-300 mt-2 leading-relaxed">{certificateDetails.extra_info}</p>
                    </div>
                  )}
                  
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                    <span className="text-purple-300 font-semibold uppercase tracking-wide text-sm">Issuing Organization</span>
                    {organizationName ? (
                      <div className="mt-2">
                        <p className="text-2xl font-bold text-white">{organizationName}</p>
                        <p className="text-sm font-mono text-slate-400 mt-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                          {certificateDetails.issuerAddress}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-mono text-slate-400 mt-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        {certificateDetails.issuerAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blockchain Verification Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/30 shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  <h3 className="text-3xl font-bold text-white">Blockchain Verified</h3>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  This certificate has been cryptographically verified on the Ethereum blockchain. 
                  It's completely decentralized, tamper-proof, and publicly auditable.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <a 
                    href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View Smart Contract
                  </a>
                  <a 
                    href={getCertificateImageUrl(ipfsHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View on IPFS
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer Section */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Decentralized & Tamper-Proof</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            TrueCert leverages blockchain technology to ensure certificates cannot be forged, altered, or falsified. 
            Every verification is cryptographically secured and publicly auditable on the Ethereum blockchain.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Cryptographically Secure</h4>
              <p className="text-slate-400 text-sm">Protected by blockchain cryptography</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Decentralized</h4>
              <p className="text-slate-400 text-sm">No central authority required</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Publicly Auditable</h4>
              <p className="text-slate-400 text-sm">Transparent and verifiable by anyone</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              Contract Address: <span className="font-mono text-slate-400">{contractAddress}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckCertificate;