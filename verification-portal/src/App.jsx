import { Routes, Route } from 'react-router-dom';
import CheckCertificate from './components/CheckCertificate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckCertificate />} />
      <Route path="/verify" element={<CheckCertificate />} />
    </Routes>
  );
}

export default App
