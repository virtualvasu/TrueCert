import { Routes, Route } from 'react-router-dom';
import VerificationHome from './pages/VerificationHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VerificationHome />} />
      <Route path="/verify" element={<VerificationHome />} />
    </Routes>
  );
}

export default App
