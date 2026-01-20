import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequestDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/requests/${id}`);
                setRequest(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRequest();
    }, [id]);

    const handleAction = async (role, decision) => {
        try {
            const endpoint = role === 'Reviewer' ? 'review' : 'approve';
            await axios.put(`http://localhost:5001/api/requests/${id}/${endpoint}`, {
                decision,
                comment
            });
            // Refresh
            const res = await axios.get(`http://localhost:5001/api/requests/${id}`);
            setRequest(res.data);
            setComment('');
        } catch (err) {
            alert('Error updating status: ' + (err.response?.data?.message || err.message));
        }
    };

    if (!request) return <div>Loading...</div>;

    const canReview = user.role === 'Reviewer' && request.reviewer.decision === 'Pending';
    const canApprove = user.role === 'Approver' && request.reviewer.decision === 'Approved' && request.approver.decision === 'Pending';

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Change Request #{request._id.substring(request._id.length - 6)}</h1>
                <span className={`px-4 py-2 rounded-full font-bold ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {request.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Requester</h3>
                    <p>{request.requester?.username}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Project/Dept</h3>
                    <p>{request.projectDepartment}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Planned Date</h3>
                    <p>{new Date(request.plannedStart).toLocaleString()} - {new Date(request.plannedEnd).toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Priority</h3>
                    <p>{request.priority}</p>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Description</h3>
                <p className="bg-gray-50 p-4 rounded">{request.description}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Reason</h3>
                <p className="bg-gray-50 p-4 rounded">{request.reason}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Annexures</h3>
                {request.annexures.length === 0 ? <p>No attachments</p> : (
                    <ul className="list-disc pl-5">
                        {request.annexures.map((path, idx) => (
                            <li key={idx}>
                                <a href={`http://localhost:5001/${path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    Attachment {idx + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Workflow Status */}
            <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Approval Workflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded border ${request.reviewer.decision === 'Approved' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                        <h4 className="font-bold">Reviewer</h4>
                        <p>Status: {request.reviewer.decision}</p>
                        {request.reviewer.actionBy && <p>By: {request.reviewer.actionBy.username}</p>}
                        {request.reviewer.comment && <p>Comment: {request.reviewer.comment}</p>}
                    </div>
                    <div className={`p-4 rounded border ${request.approver.decision === 'Approved' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                        <h4 className="font-bold">Approver</h4>
                        <p>Status: {request.approver.decision}</p>
                        {request.approver.actionBy && <p>By: {request.approver.actionBy.username}</p>}
                        {request.reviewer.decision !== 'Approved' && <p className="text-sm text-gray-500">(Waiting for Reviewer)</p>}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {(canReview || canApprove) && (
                <div className="mt-8 p-6 bg-blue-50 rounded border border-blue-200">
                    <h3 className="text-lg font-bold mb-4">Take Action ({user.role})</h3>
                    <textarea
                        className="w-full border p-2 rounded mb-4"
                        placeholder="Enter comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="flex gap-4">
                        <button onClick={() => handleAction(user.role, 'Approved')} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Approve</button>
                        <button onClick={() => handleAction(user.role, 'Rejected')} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700">Reject</button>
                    </div>
                </div>
            )}
        </div>
    );
}
