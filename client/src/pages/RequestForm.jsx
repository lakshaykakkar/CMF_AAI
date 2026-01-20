import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RequestForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectDepartment: '',
        description: '',
        reason: '',
        priority: 'P2-Medium',
        usersAffected: '',
        plannedStart: '',
        plannedEnd: '',
        implementationPlan: '',
        rollbackPlan: ''
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        for (let i = 0; i < files.length; i++) {
            data.append('annexures', files[i]);
        }

        try {
            await axios.post('http://localhost:5001/api/requests', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error creating request', err);
            alert('Error creating request');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">New Change Request</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Project / Department</label>
                        <input name="projectDepartment" onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Priority</label>
                        <select name="priority" onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="P1-High">P1-High</option>
                            <option value="P2-Medium">P2-Medium</option>
                            <option value="P3-Low">P3-Low</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Description of Change</label>
                    <textarea name="description" onChange={handleChange} required className="w-full border p-2 rounded" rows="3"></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Reason for Change</label>
                    <textarea name="reason" onChange={handleChange} required className="w-full border p-2 rounded" rows="2"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Planned Start Date & Time</label>
                        <input type="datetime-local" name="plannedStart" onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Planned End Date & Time</label>
                        <input type="datetime-local" name="plannedEnd" onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Users Affected</label>
                    <input name="usersAffected" onChange={handleChange} required className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Implementation Plan</label>
                    <textarea name="implementationPlan" onChange={handleChange} className="w-full border p-2 rounded" rows="3"></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Rollback Plan</label>
                    <textarea name="rollbackPlan" onChange={handleChange} className="w-full border p-2 rounded" rows="3"></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Attachments (Annexures for Plan/Rollback)</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Submit Request</button>
            </form>
        </div>
    );
}
