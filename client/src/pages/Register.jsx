import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Requester',
        designation: '',
        department: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input name="username" type="text" onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input name="email" type="email" onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input name="password" type="password" onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Role</label>
                        <select name="role" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                            <option value="Requester">Requester</option>
                            <option value="Reviewer">Reviewer</option>
                            <option value="Approver">Approver</option>
                            <option value="DC_Helpdesk">DC Helpdesk</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Designation</label>
                        <input name="designation" type="text" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Department</label>
                        <input name="department" type="text" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                        Register
                    </button>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-blue-500 hover:text-blue-700">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
