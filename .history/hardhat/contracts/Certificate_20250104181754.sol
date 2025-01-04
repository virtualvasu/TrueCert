// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    struct metaData {
        address issuerAddress;
        uint256 timeStamp;
    }

    mapping(string => metaData) public certificates;

    function storeCertificate(
        string memory _ipfsHash,
        address _issuerAddress
    ) public {
        metaData memory _metaData;
        _metaData.issuerAddress = _issuerAddress;
        _metaData.timeStamp = block.timestamp;

        certificates[_ipfsHash] = _metaData;
    }

    function checkExistence(
        string memory _ipfsHash
    ) public view returns (bool) {
        return certificates[_ipfsHash].issuerAddress != address(0);
    }
}
