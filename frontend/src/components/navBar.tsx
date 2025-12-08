import { Link } from "react-router";

export const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
<div className="container mx-auto flex items-center justify-between">
  <div className="text-2xl font-bold tracking-wide">
    <Link to="/" className="hover:text-indigo-400 transition-colors">ERP UI</Link>
  </div>
  <ul className="flex space-x-6">
    <li>
      <Link
        to="/"
        className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-lg font-medium"
      >
        Home
      </Link>
    </li>
    <li>
      <Link
            to="/products"
            className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-lg font-medium"    
      >
        Products    
      </Link>
    </li>
    <li>
      <Link
            to="/sales"
            className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-lg font-medium"    
      >
        Sales    
      </Link>
    </li>
    <li>
      <Link
            to="/login"
            className="hover:text-indigo-400 transition-colors px-3 py-2 rounded-md text-lg font-medium"    
      >
        Login    
      </Link>
    </li>
  </ul>
</div>
</nav>
  )
}