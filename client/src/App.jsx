import { Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminHome from './pages/Admin/AdminHome';
import UserHome from './pages/User/UserHome';
import IssuerLogin from './pages/User/Issuer/IssuerLogin';
import IssuerHome from './pages/User/Issuer/IssuerHome';
import IssuerActions from './pages/User/Issuer/IssuerActions';
import IssuerProfile from './pages/User/Issuer/IssuerProfile';
import RecipientHome from './pages/User/Recipient/RecipientHome';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/issuer/login" element={<IssuerLogin />} />
        <Route path="/user/issuer/home" element={<IssuerHome />} />
        <Route path="/user/issuer/actions" element={<IssuerActions />} />
        <Route path="/user/issuer/profile" element={<IssuerProfile />} />
        <Route path="/user/recipient/home" element={<RecipientHome />} />
      </Routes>
   
  );
}

export default App;
