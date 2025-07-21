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
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
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

        // Show result dialog
        setVerificationResult({
          success: !certDetails.isRevoked,
          type: certDetails.isRevoked ? 'revoked' : 'verified',
          message: certDetails.isRevoked 
            ? 'Certificate Revoked' 
            : 'Certificate Verified Successfully!'
        });
        setShowResultDialog(true);
      } else {
        setCertificateDetails(null);
        setOrganizationName('');
        setStatus({
          message: 'Certificate does not exist or is issued by some other organisation.',
          success: false,
        });

        // Show not found dialog
        setVerificationResult({
          success: false,
          type: 'not_found',
          message: 'Certificate Not Found'
        });
        setShowResultDialog(true);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setStatus({ message: `Error: ${error.message}`, success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-black text-gray-900">
                  True<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Cert</span>
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://truecert.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Issue Certificate
              </a>
              
              <a
                href="https://github.com/virtualvasu/TrueCert"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-gray-200/80 backdrop-blur-sm z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-500 shadow-lg shadow-purple-500/20"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Result Dialog Modal */}
      {showResultDialog && verificationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowResultDialog(false)}
          />
          
          {/* Dialog */}
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              {/* Animated Icon */}
              <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center">
                {verificationResult.type === 'verified' && (
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
                      <svg className="w-12 h-12 text-white animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
                
                {verificationResult.type === 'revoked' && (
                  <div className="relative">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce-in">
                      <svg className="w-12 h-12 text-white animate-warning-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
                
                {verificationResult.type === 'not_found' && (
                  <div className="relative">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-bounce-in">
                      <svg className="w-12 h-12 text-white animate-x-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>
              
              {/* Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {verificationResult.message}
              </h3>
              
              {/* Sub-message */}
              <p className="text-gray-600 mb-6">
                {verificationResult.type === 'verified' && 'This is a legitimate certificate issued on TrueCert'}
                {verificationResult.type === 'revoked' && 'This certificate exists but has been revoked by the issuer.'}
                {verificationResult.type === 'not_found' && 'This certificate could not be found or is from an unknown issuer.'}
              </p>
              
              {/* Close Button */}
              <button
                onClick={() => setShowResultDialog(false)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  verificationResult.success 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/10" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-indigo-500 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-purple-500 rounded-full animate-ping opacity-40 delay-700"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping opacity-50 delay-1000"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Enhanced Header */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 backdrop-blur-sm rounded-full border border-indigo-200 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700">Blockchain Powered Verification</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tight">
              True<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Cert</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl font-light text-gray-700 mt-4 tracking-wider">
                Verification Portal
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of certificate authentication with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium"> blockchain-powered security</span>, 
              ensuring every credential is <span className="text-green-600 font-medium">tamper-proof</span> and 
              <span className="text-blue-600 font-medium">globally verifiable</span>.
            </p>
          </div>

          {/* Enhanced Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-200 shadow-2xl shadow-gray-500/10 max-w-2xl mx-auto">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Certificate</h2>
                <p className="text-gray-600">Enter the certificate details to begin verification</p>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">IPFS Hash (CID)</label>
                  <InputField
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                    placeholder="Enter the 46-character IPFS hash"
                    isValid={/^[a-zA-Z0-9]{46}$/.test(ipfsHash)}
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">Issuer Organization Address</label>
                  <InputField
                    value={issuerAddress}
                    onChange={(e) => setIssuerAddress(e.target.value)}
                    placeholder="Enter the Ethereum address of the issuing organization"
                    isValid={web3.utils.isAddress(issuerAddress)}
                  />
                </div>
                
                <div className="pt-4">
                  <ActionButton onClick={handleCheckCertificate} loading={loading} disabled={loading}>
                    <div className="flex items-center justify-center space-x-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying on Blockchain...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Verify Certificate</span>
                        </>
                      )}
                    </div>
                  </ActionButton>
                </div>
              </div>
            </div>
            
            {status && (
              <div className="mt-8 p-4 rounded-xl bg-gray-50 backdrop-blur-sm border border-gray-200">
                <StatusMessage message={status.message} success={status.success} />
              </div>
            )}
          </div>

          {/* Enhanced Scroll Indicator */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center space-y-4">
              <p className="text-gray-500 text-sm font-medium">Scroll to explore verification details</p>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-ping delay-150"></div>
                <div className="w-1 h-1 bg-pink-500 rounded-full animate-ping delay-300"></div>
              </div>
              <div className="animate-bounce">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Display Section */}
      {certificateDetails && (
        <>
          {/* Enhanced Certificate Image Section */}
          <section className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-sm rounded-full border border-indigo-200 mb-8">
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-indigo-700">Certificate Document</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  Certificate 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Preview</span>
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  View the authentic certificate document stored immutably on the 
                  <span className="text-indigo-600 font-semibold">InterPlanetary File System (IPFS)</span>
                </p>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl shadow-gray-500/10">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-300">
                    <img 
                      src={getCertificateImageUrl(ipfsHash)}
                      alt="Certificate Document"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center flex-col text-gray-600 space-y-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-gray-300">
                          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-semibold text-gray-700">Certificate Document Unavailable</p>
                        <p className="text-sm text-gray-500">The IPFS document could not be loaded</p>
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                          <p className="text-xs font-mono text-gray-600 break-all">IPFS: {ipfsHash}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* IPFS Link */}
                  <div className="mt-6 text-center">
                    <a 
                      href={getCertificateImageUrl(ipfsHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on IPFS Network
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Certificate Details Section */}
          <section className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className={`inline-flex items-center px-6 py-3 backdrop-blur-sm rounded-full border mb-8 ${
                  certificateDetails.isRevoked 
                    ? 'bg-gradient-to-r from-red-100 to-red-50 border-red-200' 
                    : 'bg-gradient-to-r from-green-100 to-emerald-50 border-green-200'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                    certificateDetails.isRevoked ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <span className={`text-sm font-semibold ${
                    certificateDetails.isRevoked ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {certificateDetails.isRevoked ? 'Certificate Revoked' : 'Certificate Verified'}
                  </span>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
                  <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                    Certificate 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Details</span>
                  </h2>
                  <div className={`px-8 py-4 rounded-2xl text-xl font-bold shadow-lg ${
                    certificateDetails.isRevoked 
                      ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-300' 
                      : 'bg-gradient-to-r from-green-100 to-emerald-50 text-green-700 border border-green-300'
                  }`}>
                    {certificateDetails.isRevoked ? '⚠️ REVOKED' : '✅ VERIFIED'}
                  </div>
                </div>
                
                <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  Complete certificate information retrieved from the blockchain, ensuring 
                  <span className="text-green-600 font-semibold"> authenticity</span> and 
                  <span className="text-blue-600 font-semibold">integrity</span>
                </p>
              </div>
              
              {/* Certificate Details Table */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Recipient</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{certificateDetails.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Certificate Title</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{certificateDetails.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-5m0 0l3 3m-3-3l-3 3" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Issue Date</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{certificateDetails.timeStamp}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Issuing Organization</p>
                        {organizationName ? (
                          <div className="mt-1">
                            <p className="text-lg font-bold text-gray-900">{organizationName}</p>
                            <p className="text-sm font-mono text-gray-500 mt-1 break-all">
                              {certificateDetails.issuerAddress}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm font-mono text-gray-700 mt-1 break-all">
                            {certificateDetails.issuerAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {certificateDetails.extra_info && (
                    <div className="flex items-start p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start min-w-0 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</p>
                          <p className="text-gray-700 mt-1 leading-relaxed">{certificateDetails.extra_info}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Blockchain Verification Section */}
          <section className="py-24 px-4 relative">
            <div className="max-w-6xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-12 border border-gray-200 shadow-2xl">
                  
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-sm rounded-full border border-green-200 mb-8">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                      <span className="text-sm font-semibold text-green-700">Blockchain Security Verified</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                      Cryptographically 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Secured</span>
                    </h3>
                    
                    <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
                      This certificate has been verified on the <span className="text-indigo-600 font-semibold">Ethereum blockchain</span>, 
                      ensuring it's completely <span className="text-green-600 font-semibold">tamper-proof</span>, 
                      <span className="text-purple-600 font-semibold">decentralized</span>, and 
                      <span className="text-pink-600 font-semibold">publicly auditable</span> forever.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <a 
                      href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-black">View Smart Contract</p>
                          <p className="text-sm text-white/70">Ethereum Sepolia Network</p>
                        </div>
                      </div>
                    </a>
                    
                    <a 
                      href={getCertificateImageUrl(ipfsHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-black">View on IPFS</p>
                          <p className="text-sm text-white/70">Decentralized Storage</p>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Security Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-green-500/30">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Cryptographically Secure</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Protected by advanced blockchain cryptography</p>
                    </div>
                    
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-purple-500/30">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Fully Decentralized</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">No central authority or single point of failure</p>
                    </div>
                    
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Publicly Auditable</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Transparent and verifiable by anyone, anywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Enhanced Footer Section */}
      <section className="py-20 px-4 relative border-t border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-sm rounded-full border border-indigo-200 mb-8">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-semibold text-indigo-700">Powered by Blockchain Technology</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              The Future of 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Certificate Verification</span>
            </h3>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              TrueCert leverages blockchain (smart contracts) to ensure certificates cannot be forged, altered, or falsified. 
              Every verification is <span className="text-green-600 font-semibold">cryptographically secured</span> and 
              <span className="text-blue-600 font-semibold">publicly auditable</span> on the Ethereum blockchain. This completely eliminates the need to trust a third party to maintain authenticity of the documents.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="group text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-4.423A15.806 15.806 0 01212 6.23a15.8 15.8 0 01-5.982 5.759M9.05 9.94c.39.49.85.76 1.395.76.54 0 1.004-.27 1.394-.76.39-.49.61-1.12.61-1.836C12.45 6.44 11.43 5 10 5s-2.45 1.44-2.45 3.104c0 .716.22 1.345.61 1.836z" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-3">Instant Verification</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Verify certificates in seconds with blockchain technology</p>
            </div>
            
            <div className="group text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-3">Cryptographically Secure</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Protected by advanced blockchain cryptography</p>
            </div>
            
            <div className="group text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-3">Fully Decentralized</h4>
              <p className="text-gray-600 text-sm leading-relaxed">No central authority or single point of failure</p>
            </div>
            
            <div className="group text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-gray-900 font-bold text-lg mb-3">Publicly Auditable</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Transparent and verifiable by anyone, anywhere</p>
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-left">
                <p className="text-sm font-bold text-gray-600 mb-1 uppercase tracking-wider">Smart Contract Address</p>
                <p className="text-lg font-mono text-gray-900 break-all">{contractAddress}</p>
              </div>
              <div className="flex space-x-4">
                <a 
                  href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Etherscan
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Made with ❤️ by <strong>Vasu.</strong> 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckCertificate;