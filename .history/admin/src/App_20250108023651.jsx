import './App.css'
import { useState } from 'react'
import RegisterOrganisation from './RegisterOrganisation' // Ensure this is correctly imported

function App() {
  const [isStoreOrganisationVisible, setIsStoreOrganisationVisible] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsStoreOrganisationVisible(true)}
        className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${isStoreOrganisationVisible
          ? 'bg-yellow-700'
          : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
      >
        Store Organisation
      </button>
      {
        isStoreOrganisationVisible && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Store Organisation
            </h2>
            <RegisterOrganisation />
          </div>
        )
      }
    </>
  )
}

export default App
