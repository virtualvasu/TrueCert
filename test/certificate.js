const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateStorage Contract", function () {
    let CertificateStorage;
    let certificateStorage;
    let owner;
    let addr1;

    beforeEach(async function () {
        CertificateStorage = await ethers.getContractFactory("CertificateStorage");
        [owner, addr1] = await ethers.getSigners(); 
        certificateStorage = await CertificateStorage.deploy();
        await certificateStorage.deployed();
    });

    describe("Store Certificate", function () {
        it("should store an IPFS hash with issuer address", async function () {
            const ipfsHash = "QmTzQ1Yz94ZG3yFHsDdMkG9K8CTjbqXXy6hoVpWhQbXYj";
            const issuerAddress = owner.address; // Use owner's address as issuer
            
            await certificateStorage.storeCertificate(ipfsHash, issuerAddress);
            
            const exists = await certificateStorage.checkExistence(ipfsHash);
            expect(exists).to.be.true;
        });

        it("should not store duplicate IPFS hashes", async function () {
            const ipfsHash = "QmTzQ1Yz94ZG3yFHsDdMkG9K8CTjbqXXy6hoVpWhQbXYj";
            const issuerAddress = owner.address; // Use owner's address as issuer
            
            await certificateStorage.storeCertificate(ipfsHash, issuerAddress);
            // Store again with the same IPFS hash
            await certificateStorage.storeCertificate(ipfsHash, issuerAddress);
            
            const exists = await certificateStorage.checkExistence(ipfsHash);
            expect(exists).to.be.true;
        });
    });

    describe("Check Certificate", function () {
        it("should return false if the IPFS hash doesn't exist", async function () {
            const ipfsHash = "QmNonExistentHash12345";
            
            const exists = await certificateStorage.checkExistence(ipfsHash);
            expect(exists).to.be.false;
        });

        it("should return true if the IPFS hash exists", async function () {
            const ipfsHash = "QmTzQ1Yz94ZG3yFHsDdMkG9K8CTjbqXXy6hoVpWhQbXYj";
            const issuerAddress = owner.address; // Use owner's address as issuer
            
            await certificateStorage.storeCertificate(ipfsHash, issuerAddress);
            
            const exists = await certificateStorage.checkExistence(ipfsHash);
            expect(exists).to.be.true;
        });
    });
});
