import React, { useState } from 'react';
import OrgHome from './components/organisation/OrgHome';

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center">TrueCert</h1>
        <p className="text-center text-sm mt-2">Streamlining certificate management</p>
      </header>
      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <OrgHome />
        </div>
      </main>
    </div>
  );
}

export default App;
