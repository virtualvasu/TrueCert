import React from 'react';
import IssueCertificate from './components/organisation/IssueCertificate';
import CheckCertificate from './components/organisation/CheckCertificate';
import RevokeCertificate from './components/organisation/RevokeCertificate';
import StoreOrganisation from './components/organisation/StoreOrganisation';

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
