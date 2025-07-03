import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">User Management</h1>
      <div className="space-x-4 text-sm">
        <NavLink to="/" className="text-white hover:underline">Home</NavLink>
        <NavLink to="/users" className="text-white hover:underline">Users</NavLink>
        <NavLink to="/new" className="text-white hover:underline">New User</NavLink>
      </div>
    </nav>
  );
}
