
import './App.css'

import { useState } from 'react'

function App() {
  const [state, setState] = useState(false)

  return (
    <>
      <button
        onClick={() => setState(true)}
        className={`px-6 py-3 font-medium text-white rounded-lg shadow-md transition ${activeComponent === 'StoreOrganisation'
          ? 'bg-yellow-700'
          : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
      >
        Store Organisation
      </button>
      {
        state && (
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
