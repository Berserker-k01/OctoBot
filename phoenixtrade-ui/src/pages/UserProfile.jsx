import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import { User, Mail, Package, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await authApi.getProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center">
                <div className="text-cyan-400">Chargement...</div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Vous devez être connecté pour voir votre profil</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-cyan-400 text-slate-900 rounded font-bold hover:bg-cyan-300"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400">Profil Utilisateur</h1>
                    <p className="text-gray-400 mt-2">Gérez vos informations et paramètres</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations du profil */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <User className="mr-2 text-cyan-400" size={24} />
                            Informations personnelles
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="text-gray-400" size={20} />
                                <div>
                                    <div className="text-sm text-gray-400">Email</div>
                                    <div className="text-white font-medium">{profile?.email || currentUser.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Package className="text-gray-400" size={20} />
                                <div>
                                    <div className="text-sm text-gray-400">Plan</div>
                                    <div className="text-white font-medium capitalize">
                                        {profile?.plan || currentUser.plan || 'free'}
                                    </div>
                                </div>
                            </div>
                            {profile?.status && (
                                <div className="flex items-center space-x-3">
                                    <Settings className="text-gray-400" size={20} />
                                    <div>
                                        <div className="text-sm text-gray-400">Statut</div>
                                        <div className={`font-medium capitalize ${
                                            profile.status === 'active' ? 'text-green-400' : 
                                            profile.status === 'pending' ? 'text-yellow-400' : 
                                            'text-red-400'
                                        }`}>
                                            {profile.status}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <Settings className="mr-2 text-cyan-400" size={24} />
                            Actions
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/subscription')}
                                className="w-full px-4 py-3 bg-cyan-400 text-slate-900 rounded-lg font-bold hover:bg-cyan-300 transition flex items-center justify-center"
                            >
                                <Package className="mr-2" size={20} />
                                Gérer l'abonnement
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition"
                            >
                                Retour au tableau de bord
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500 transition flex items-center justify-center"
                            >
                                <LogOut className="mr-2" size={20} />
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

