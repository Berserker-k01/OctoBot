import React, { useEffect, useState } from 'react';
import { botService } from '../services/botService';
import { Play, Square, Activity, DollarSign, Wallet } from 'lucide-react';

export default function Dashboard() {
    const [status, setStatus] = useState('loading');
    const [portfolio, setPortfolio] = useState(null);
    const [profit, setProfit] = useState(null);
    const [error, setError] = useState(null);
    const [strategy, setStrategy] = useState(null);

    const fetchData = async () => {
        try {
            setError(null);
            const statusData = await botService.getStatus();
            setStatus(statusData.status || 'offline');
            setStrategy(statusData.strategy || null);

            // Afficher l'erreur si elle existe dans la réponse
            if (statusData.error) {
                setError(statusData.error);
            }

            if (statusData.status === 'running' || statusData.status === 'online') {
                try {
                    const portfolioData = await botService.getPortfolio();
                    setPortfolio(portfolioData);
                } catch (err) {
                    console.warn('Could not fetch portfolio:', err);
                }
                try {
                    const profitData = await botService.getProfit();
                    setProfit(profitData);
                } catch (err) {
                    console.warn('Could not fetch profit:', err);
                }
            }
        } catch (err) {
            console.error('Error fetching bot data:', err);
            setError(err.message || 'Impossible de se connecter au bot');
            setStatus('offline');
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleStart = async () => {
        await botService.startBot();
        fetchData();
    };

    const handleStop = async () => {
        await botService.stopBot();
        fetchData();
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-cyan-400 text-xl mb-4">Chargement du dashboard...</div>
                    <div className="text-gray-400">Connexion au bot en cours</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-400">PhoenixTrade Dashboard</h1>
                        <p className="text-gray-400">Manage your trading bot</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm ${status === 'running' || status === 'online' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                            }`}>
                            {status}
                        </div>
                    </div>
                </header>

                {error && (
                    <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 p-4 rounded-lg">
                        <p className="font-semibold">⚠️ API Backend non disponible</p>
                        <p className="text-sm mt-1">{error}</p>
                        <p className="text-xs mt-2 text-gray-400">
                            Le backend OctoBot n'expose pas encore les endpoints API REST nécessaires. 
                            Le dashboard fonctionne en mode dégradé. Pour activer toutes les fonctionnalités, 
                            vous devez créer un wrapper API qui expose les endpoints suivants :
                        </p>
                        <ul className="text-xs mt-2 text-gray-400 list-disc list-inside">
                            <li><code>/api/status</code> - Statut du bot</li>
                            <li><code>/api/portfolio</code> - Informations du portefeuille</li>
                            <li><code>/api/profitability</code> - Données de profitabilité</li>
                            <li><code>/api/bot/start</code> - Démarrer le bot</li>
                            <li><code>/api/bot/stop</code> - Arrêter le bot</li>
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Controls */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><Activity className="mr-2 text-cyan-400" /> Status</h3>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleStart}
                                disabled={status === 'running' || status === 'online'}
                                className="flex-1 flex items-center justify-center py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition"
                            >
                                <Play className="mr-2" size={20} /> Start
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={status !== 'running' && status !== 'online'}
                                className="flex-1 flex items-center justify-center py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition"
                            >
                                <Square className="mr-2" size={20} /> Stop
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            {strategy ? strategy.replace(/OctoBot/g, 'Phoenix') : 'No active strategy'}
                        </p>
                    </div>

                    {/* Profit */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><DollarSign className="mr-2 text-green-400" /> Profit/Loss</h3>
                        <div className="text-3xl font-bold font-mono">
                            {profit ? `${profit.total_profit_percent || '0.00'}%` : '---'}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">Total PnL</div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><Wallet className="mr-2 text-purple-400" /> Portfolio</h3>
                        <div className="text-3xl font-bold font-mono">
                            {portfolio ? `$${portfolio.total_valuation || '0.00'}` : '---'}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">Current Valuation</div>
                    </div>
                </div>

                {/* Detailed Stats Placeholder */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg min-h-[300px] flex items-center justify-center text-gray-500">
                    Chart Visualization Coming Soon
                </div>
            </div>
        </div>
    );
}
