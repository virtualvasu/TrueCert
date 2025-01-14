import { Link } from 'react-router-dom';

function RoleSelection() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-pink-500 to-yellow-400 text-center p-4">
      <h1 className="text-4xl font-bold text-white mb-6">TrueCert</h1>
      <p className="text-lg text-white mb-12">Select your role:</p>
      <div className="flex flex-col gap-4">
        <Link
          to="/admin/login"
          className="text-lg text-white bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Admin
        </Link>
        <Link
          to="/user/home"
          className="text-lg text-white bg-gray-800 px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          User
        </Link>
      </div>
    </div>
  );
}

export default RoleSelection;
