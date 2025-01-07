import React from 'react';
import IssueCertificate from './components/IssueCertificate';
import CheckCertificate from './components/CheckCertificate';
import RevokeCertificate from './components/RevokeCertificate';
import StoreOrganisation from './components/StoreOrganisation';

function App() {
    return (
        <div>
            <h1>TrueCert</h1>
            <IssueCertificate />
            <CheckCertificate />
            <RevokeCertificate />
            <StoreOrganisation />
        </div>
    );
}

export default App;
