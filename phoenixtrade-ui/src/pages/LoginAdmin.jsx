import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function LoginAdmin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.email !== 'admin@phoenixtrade.com') {
                setError('Access denied: You are not an administrator.');
                return;
            }
            navigate('/admin');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-2xl border border-red-900/30">
                <div className="flex flex-col items-center">
                    <Shield className="w-12 h-12 text-red-500 mb-2" />
                    <h2 className="text-3xl font-bold text-center text-red-500">Admin Portal</h2>
                    <p className="text-center text-gray-400">Restricted Access</p>
                </div>

                {error && <div className="p-3 text-red-500 bg-red-900/20 rounded border border-red-900/50">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Admin Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 bg-slate-800 text-white border border-slate-700 rounded focus:ring-red-500 focus:border-red-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 bg-slate-800 text-white border border-slate-700 rounded focus:ring-red-500 focus:border-red-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 font-bold text-white bg-red-600 rounded hover:bg-red-500 transition shadow-lg shadow-red-900/20">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
