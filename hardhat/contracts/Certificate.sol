// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    struct metaData {
        address issuerAddress;
        uint256 timeStamp;
        bool isRevoked;
    }

    mapping(string => metaData) public certificates;
    mapping(string => string) public organisations;

    function storeCertificate(
        string memory _ipfsHash,
        address _issuerAddress
    ) public {
        require(
            certificates[_ipfsHash].issuerAddress == address(0),
            "Certificate already exists"
        );

        metaData memory _metaData;
        _metaData.issuerAddress = _issuerAddress;
        _metaData.timeStamp = block.timestamp;
        _metaData.isRevoked = false;

        certificates[_ipfsHash] = _metaData;
    }

    function checkExistence(
        string memory _ipfsHash,
        address _issuerAddress
    ) public view returns (bool) {
        metaData memory cert = certificates[_ipfsHash];
        return (cert.issuerAddress == _issuerAddress && !cert.isRevoked);
    }

    function revokeCertificate(string memory _ipfsHash) public returns (bool) {
        require(
            certificates[_ipfsHash].issuerAddress != address(0),
            "Certificate does not exist"
        );
        require(
            certificates[_ipfsHash].isRevoked == false,
            "Certificate is already revoked"
        );

        certificates[_ipfsHash].isRevoked = true;
        return true;
    }

    function getCertificate(
        string memory _ipfsHash
    )
        public
        view
        returns (address issuerAddress, uint256 timeStamp, bool isRevoked)
    {
        metaData memory cert = certificates[_ipfsHash];
        require(cert.issuerAddress != address(0), "Certificate does not exist");
        return (cert.issuerAddress, cert.timeStamp, cert.isRevoked);
    }
    //admin fucntions

    function storeOrganisation(
        string memory _orgAddress,
        string memory _orgName
    ) public {
        organisations[_orgAddress] = _orgName;
    }
    function checkOrganisationExistence(
        string memory _orgAddress
    ) public view returns (bool) {
        return bytes(organisations[_orgAddress]).length > 0;
    }

    function revokeOrganisation(
        string memory _orgAddress
    ) public returns (bool) {
        require(
            bytes(organisations[_orgAddress]).length > 0,
            "Organisation does not exist"
        );
        delete organisations[_orgAddress];
        return true;
    }

    function getOrgName(string memory _orgAddress) public view returns (string memory) {
        require(
            bytes(organisations[_orgAddress]).length > 0,
            "Organisation does not exist"
        );
        return organisations[_orgAddress];
    }
}
