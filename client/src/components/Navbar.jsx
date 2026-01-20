import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Change Management</Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span>Welcome, {user.username} ({user.role})</span>
                            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                            {user.role === 'Requester' && (
                                <Link to="/new-request" className="hover:text-gray-300">New Request</Link>
                            )}
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
