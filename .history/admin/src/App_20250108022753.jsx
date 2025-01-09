import { useState } from 'react'
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
    </>
  )
}

export default App
