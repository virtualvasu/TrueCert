import React, { useState } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "../../../assets/contractDetails";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IssuerLogin = () => {
  const [userAccount, setUserAccount] = useState(null);
  const [error, setError] = useState("");
  const [orgExists, setOrgExists] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [issuerAddress, setIssuerAddress] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const initializeWeb3 = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed. Please install MetaMask to proceed.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts && accounts.length > 0) {
        setUserAccount(web3.utils.toChecksumAddress(accounts[0]));
        checkOrganisation(web3, web3.utils.toChecksumAddress(accounts[0]));
      } else {
        setError("No MetaMask account connected. Please connect your account.");
      }
    } catch (err) {
      setError("Error connecting to MetaMask. Please try again.");
      console.error(err);
    }
  };

  const checkOrganisation = async (web3, userAccount) => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const organisationExists = await contract.methods.checkOrganisationExistence(userAccount).call();

      setOrgExists(organisationExists);
    } catch (error) {
      console.error("Error:", error.message);
      setError(`Error: ${error.message}`);
    }
  };

  const handleRequestRegistration = async () => {
    setIsRequesting(true);
    try {
      const registrationData = {
        recipient: import.meta.env.VITE_RECIEVER_EMAIL,
        subject: "TrueCert issuer registration request",
        body: `Issuer's blockchain address: ${issuerAddress}\nIssuer's name: ${issuerName}`,
      };

      const serverURL = import.meta.env.VITE_SERVER_URL;
      const response = await fetch(`${serverURL}/registration/fromissuer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        setSuccessMessage("Your registration request has been sent. Wait for admin's approval.");
      } else {
        setError("Failed to send registration request. Please try again.");
      }
    } catch (err) {
      setError("Failed to send registration request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRedirect = () => {
    navigate("/user/issuer/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-800">
            Issuer Login
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Access your account securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={initializeWeb3} className="w-full">
            Connect MetaMask
          </Button>

          {userAccount && (
            <p className="text-center text-green-700">
              Connected Account: <span className="font-medium">{userAccount}</span>
            </p>
          )}

          {orgExists !== null && (
            <div className="mt-4">
              {orgExists ? (
                <div className="flex items-center bg-green-100 p-4 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
                  <p className="text-green-700">Your organization is registered on the blockchain!</p>
                </div>
              ) : (
                <div className="flex items-center bg-red-100 p-4 rounded-lg">
                  <XCircleIcon className="w-6 h-6 text-red-600 mr-2" />
                  <p className="text-red-700">
                    Your organization is not registered as an issuer on <b>TrueCert</b>.
                  </p>
                </div>
              )}
            </div>
          )}

          {orgExists && (
            <Button onClick={handleRedirect} className="w-full bg-green-600 hover:bg-green-700">
              Go to Issuer Home
            </Button>
          )}

          {orgExists === false && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRequestRegistration();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="issuerAddress" className="block text-sm text-slate-700">
                  Issuer's Blockchain Address
                </label>
                <Input
                  id="issuerAddress"
                  type="text"
                  value={issuerAddress}
                  onChange={(e) => setIssuerAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="issuerName" className="block text-sm text-slate-700">
                  Issuer's Name
                </label>
                <Input
                  id="issuerName"
                  type="text"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isRequesting}>
                {isRequesting ? "Requesting..." : "Request Registration"}
              </Button>
            </form>
          )}

          {successMessage && (
            <p className="text-center text-green-700">{successMessage}</p>
          )}

          {error && (
            <p className="text-center text-red-700">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IssuerLogin;
