async function handleIssueCertificate() {
    try {
        const { web3, userAccount } = await initializeWeb3();

        const studentName = document.getElementById('studentName').value.trim();
        const por = document.getElementById('por').value.trim();
        const society = document.getElementById('society').value.trim();

        if (!studentName || !por || !society) {
            alert('Please fill in all fields.');
            return;
        }

        // Fetch organisation address (could be based on society or user input)
        const orgAddress = document.getElementById('orgAddress').value.trim();
        if (!orgAddress) {
            alert('Please provide the organisation address.');
            return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Check if the organisation is registered
        const isOrganisationRegistered = await contract.methods.checkOganisationExistence(orgAddress).call();
        if (!isOrganisationRegistered) {
            alert('The organisation is not registered. Please register the organisation first.');
            return;
        }

        // Proceed with issuing the certificate
        const response = await fetch('http://localhost:3000/certificates/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentName, por, society })
        });

        if (!response.ok) throw new Error(await response.text());

        const { ipfsHash } = await response.json();
        console.log("IPFS Hash:", ipfsHash);

        const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

        alert(`Certificate stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}
