import React, { useState } from 'react';
import { Check, X, Eye, Shield } from 'lucide-react';

const MOCK_PENDING_USERS = [
    { id: 1, email: 'user1@example.com', plan: 'Pro (90 Days)', proof: 'https://via.placeholder.com/300', date: '2023-10-25' },
    { id: 2, email: 'crypto_king@test.com', plan: 'Elite (365 Days)', proof: 'https://via.placeholder.com/300', date: '2023-10-26' },
    { id: 3, email: 'newbie_trader@gmail.com', plan: 'Starting (30 Days)', proof: 'https://via.placeholder.com/300', date: '2023-10-27' },
];

export default function AdminDashboard() {
    const [users, setUsers] = useState(MOCK_PENDING_USERS);
    const [selectedProof, setSelectedProof] = useState(null);

    const handleApprove = (id) => {
        if (confirm('Approve this user subscription?')) {
            setUsers(users.filter(u => u.id !== id));
            // In real app: Call Cloud Function to update user status
        }
    };

    const handleReject = (id) => {
        if (confirm('Reject this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-red-500 flex items-center">
                            <Shield className="mr-3" /> PhoenixTrade Admin
                        </h1>
                        <p className="text-gray-400">Validation Center</p>
                    </div>
                    <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                        <span className="text-sm text-gray-400">Pending Actions: </span>
                        <span className="font-bold text-white">{users.length}</span>
                    </div>
                </header>

                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">User Email</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Proof</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-700/50 transition">
                                    <td className="px-6 py-4 text-gray-400">{user.date}</td>
                                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                    <td className="px-6 py-4 text-cyan-400">{user.plan}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedProof(user.proof)}
                                            className="flex items-center text-sm text-gray-400 hover:text-white transition"
                                        >
                                            <Eye size={16} className="mr-1" /> View
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded hover:bg-green-500/30 transition text-sm font-bold"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id)}
                                            className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition text-sm font-bold"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No pending validations. Good job!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedProof && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProof(null)}>
                        <div className="max-w-2xl w-full bg-slate-900 p-4 rounded-xl border border-slate-700">
                            <img src={selectedProof} alt="Payment Proof" className="w-full h-auto rounded" />
                            <p className="mt-4 text-center text-gray-500 text-sm">Click anywhere to close</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
