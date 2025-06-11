import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-white border-b border-gray-200">
    <div className="container mx-auto flex justify-between items-center h-16 px-4">
      <Link to="/" className="font-bold text-xl text-gray-800 hover:text-black">
        SF 小舖
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="text-lg text-gray-600 hover:text-black">
          Shop
        </Link>
        <Link to="/register" className="text-lg text-gray-600 hover:text-black">
          Register
        </Link>
      </div>
    </div>
  </nav>
);

export default NavBar; 