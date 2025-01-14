import { Link } from 'react-router-dom';

function UserHome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">TrueCert</h1>
        <p className="text-lg text-gray-600 mb-8">Select your user role to proceed:</p>

        <div className="space-y-6">
          <Link
            to="/user/issuer/login"
            className="block px-10 py-5 font-semibold text-white bg-green-600 rounded-xl shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Issuer
          </Link>

          <Link
            to="/user/recipient/home"
            className="block px-10 py-5 font-semibold text-white bg-green-500 rounded-xl shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            Recipient
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
