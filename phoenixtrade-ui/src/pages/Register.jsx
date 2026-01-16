import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/subscription');
        } catch (err) {
            setError('Failed to create account: ' + err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-center text-cyan-400">PhoenixTrade</h2>
                <p className="text-center text-gray-400">Create new account</p>

                {error && <div className="p-3 text-red-500 bg-red-900/30 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 bg-slate-700 text-white border border-slate-600 rounded focus:ring-cyan-500 focus:border-cyan-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 bg-slate-700 text-white border border-slate-600 rounded focus:ring-cyan-500 focus:border-cyan-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 font-bold text-slate-900 bg-cyan-400 rounded hover:bg-cyan-300 transition">
                        Sign Up
                    </button>
                </form>
                <div className="text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
