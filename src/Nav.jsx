// components/Nav.js
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Nav() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-green-100 p-2 rounded-full">
          <Leaf className="text-green-700 h-6 w-6" />
        </div>
        <Link to="/" className="text-xl font-bold text-green-800 hover:text-green-600">
        Register/Login
        </Link>
      </div>
      <ul className="flex space-x-6 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Register/Login
          </Link>
        </li>
        <li>
          <Link
            to="/home"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Carbon Tracker
          </Link>
        </li>
        <li>
          <Link
            to="/CarbonSustainabilityApp"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Seasonal Reminders
          </Link>
        </li>
      </ul>
    </nav>
  );
}
