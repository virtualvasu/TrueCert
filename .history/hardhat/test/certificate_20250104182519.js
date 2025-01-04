// Import necessary libraries
const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const { ethers } = require("hardhat");

describe("CertificateStorage Contract", function () {
    let CertificateStorage;
    let certificateStorage;
    let owner;
    let issuerAddress;
    const ipfsHash = "QmT5NvUtoM9zZz2n1Z1c2d8b6f5e7u3h6e7r9k3d7e8t5s";

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
        
        await expect(
            certificateStorage.storeCertificate(ipfsHash, issuerAddress.address)
        ).to.be.revertedWith("Certificate already exists");
    });

    it("should revoke a certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);
        
        const revoked = await certificateStorage.revokeCertificate(ipfsHash);
        
        expect(revoked).to.equal(true); // Ensure this matches what your contract returns

        const cert = await certificateStorage.certificates(ipfsHash);
        expect(cert.isRevoked).to.equal(true);
    });

    it("should not allow revoking a non-existent certificate", async function () {
        await expect(
            certificateStorage.revokeCertificate(ipfsHash)
        ).to.be.revertedWith("Certificate does not exist");
    });

    it("should get the details of a stored certificate", async function () {
        await certificateStorage.storeCertificate(ipfsHash, issuerAddress.address);
        
        const [issuerAddr, timeStamp, isRevoked] = await certificateStorage.getCertificate(ipfsHash);
        
        expect(issuerAddr).to.equal(issuerAddress.address);
        expect(timeStamp).to.be.instanceOf(ethers.BigNumber); // Check if timestamp is BigNumber
        expect(isRevoked).to.equal(false);
    });

    it("should not allow getting details of a non-existent certificate", async function () {
        await expect(
            certificateStorage.getCertificate(ipfsHash)
        ).to.be.revertedWith("Certificate does not exist");
    });
});
