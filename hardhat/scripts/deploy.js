const { ethers } = require("hardhat");

async function main() {
    
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    
    const CertificateStorage = await ethers.getContractFactory("CertificateStorage");

    
    const certificateStorage = await CertificateStorage.deploy();

    
    await certificateStorage.deployed();

    console.log("CertificateStorage contract deployed at address:", certificateStorage.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying the contract:", error);
        process.exit(1);
    });
