import { Link } from 'react-router-dom';

function UserHome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">TrueCert</h1>
        <p className="text-lg text-gray-600 mb-6">Select your user type:</p>

        <div className="space-y-4">
          <Link
            to="/user/issuer/login"
            className="block px-8 py-4 font-medium text-white bg-orange-600 rounded-lg shadow-md hover:bg-orange-700 transition-all duration-300"
          >
            Issuer
          </Link>

          <Link
            to="/user/recipient/home"
            className="block px-8 py-4 font-medium text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
          >
            Recipient
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
