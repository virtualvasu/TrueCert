import React, { useState } from 'react';
import OrgHome from './components/organisation/OrgHome';

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-semibold text-center">TrueCert</h1>
      </header>
      <main className="p-6">
        <OrgHome />
      </main>
    </div>
  );
}

export default App;
