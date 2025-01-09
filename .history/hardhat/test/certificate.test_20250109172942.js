// Import necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateStorage Contract", function () {
    let CertificateStorage;
    let certificateStorage;
    let owner;
    let issuerAddress;
    const ipfsHash = "QmT5NvUtoM9zZz2n1Z1c2d8b6f5e7u3h6e7r9k3d7e8t5s";
    const orgAddress = "0x1234567890abcdef1234567890abcdef12345678";
    const orgName = "Blockchain Institute";

    beforeEach(async function () {
        CertificateStorage = await ethers.getContractFactory("CertificateStorage");
        [owner, issuerAddress] = await ethers.getSigners();
        certificateStorage = await CertificateStorage.deploy();
        await certificateStorage.deployed();
    });

    it("should store a certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);

        const cert = await certificateStorage.certificates(ipfsHash);

        expect(cert.issuerAddress).to.equal(issuerAddress.address);
        expect(cert.timeStamp).to.be.instanceOf(ethers.BigNumber); // Check if timestamp is BigNumber
        expect(cert.isRevoked).to.equal(false);
    });

    it("should check existence of a certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);

        const exists = await certificateStorage.checkExistence(ipfsHash, issuerAddress.address);

        expect(exists).to.equal(true);
    });

    it("should not allow storing the same certificate twice", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);

        let errorOccurred = false;
        try {
            await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);
        } catch (error) {
            errorOccurred = true;
            expect(error.message).to.include("Certificate already exists");
        }

        expect(errorOccurred).to.be.true; // Ensure an error occurred
    });

    it("should revoke a certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);

        const transactionResponse = await certificateStorage.revokeCertificate(ipfsHash);
        const receipt = await transactionResponse.wait(); // Wait for the transaction to be mined

        expect(receipt.status).to.equal(1); // Check if transaction was successful

        const cert = await certificateStorage.certificates(ipfsHash);
        expect(cert.isRevoked).to.equal(true);
    });

    it("should not allow revoking a non-existent certificate", async function () {
        let errorOccurred = false;
        try {
            await certificateStorage.revokeCertificate(ipfsHash);
        } catch (error) {
            errorOccurred = true;
            expect(error.message).to.include("Certificate does not exist");
        }

        expect(errorOccurred).to.be.true; // Ensure an error occurred
    });

    it("should get the details of a stored certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);

        const [issuerAddr, timeStamp, isRevoked] = await certificateStorage.getCertificate(ipfsHash);

        expect(issuerAddr).to.equal(issuerAddress.address);
        expect(timeStamp).to.be.instanceOf(ethers.BigNumber); // Check if timestamp is BigNumber
        expect(isRevoked).to.equal(false);
    });

    it("should not allow getting details of a non-existent certificate", async function () {
        let errorOccurred = false;
        try {
            await certificateStorage.getCertificate(ipfsHash);
        } catch (error) {
            errorOccurred = true;
            expect(error.message).to.include("Certificate does not exist");
        }

        expect(errorOccurred).to.be.true; // Ensure an error occurred
    });

    // Tests for storeOrganisation function
    it("should store an organisation", async function () {
        await certificateStorage.storeOrganisation(orgAddress, orgName);

        const storedOrgName = await certificateStorage.organisations(orgAddress);

        expect(storedOrgName).to.equal(orgName);
    });

    it("should overwrite an existing organisation's name", async function () {
        await certificateStorage.storeOrganisation(orgAddress, orgName);

        const newOrgName = "Updated Blockchain Institute";
        await certificateStorage.storeOrganisation(orgAddress, newOrgName);

        const updatedOrgName = await certificateStorage.organisations(orgAddress);
        expect(updatedOrgName).to.equal(newOrgName);
    });

    it("should return an empty string for a non-existent organisation", async function () {
        const nonExistentOrgName = await certificateStorage.organisations(orgAddress);

        expect(nonExistentOrgName).to.equal("");
    });

    // Tests for checkOrganisationExistence function
    it("should return true for an existing organisation", async function () {
        await certificateStorage.storeOrganisation(orgAddress, orgName);

        const exists = await certificateStorage.checkOganisationExistence(orgAddress);

        expect(exists).to.equal(true);
    });

    it("should return false for a non-existent organisation", async function () {
        const nonExistentOrgAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef";
        const exists = await certificateStorage.checkOganisationExistence(nonExistentOrgAddress);

        expect(exists).to.equal(false);
    });

    
    it("should revoke an organisation", async function () {
        await certificateStorage.storeOrganisation(orgAddress, orgName);

        const transactionResponse = await certificateStorage.revokeOrganisation(orgAddress);
        const receipt = await transactionResponse.wait();

        expect(receipt.status).to.equal(1); 

        const orgNameAfterRevoke = await certificateStorage.organisations(orgAddress);
        expect(orgNameAfterRevoke).to.equal(""); 
    });

    it("should not allow revoking a non-existent organisation", async function () {
        let errorOccurred = false;
        try {
            await certificateStorage.revokeOrganisation(orgAddress);
        } catch (error) {
            errorOccurred = true;
            expect(error.message).to.include("Organisation does not exist");
        }

        expect(errorOccurred).to.be.true; // Ensure an error occurred
    });
});
