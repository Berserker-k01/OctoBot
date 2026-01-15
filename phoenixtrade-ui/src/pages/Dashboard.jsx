import React, { useEffect, useState } from 'react';
import { botService } from '../services/botService';
import { Play, Square, Activity, DollarSign, Wallet } from 'lucide-react';

export default function Dashboard() {
    const [status, setStatus] = useState('loading');
    const [portfolio, setPortfolio] = useState(null);
    const [profit, setProfit] = useState(null);

    const fetchData = async () => {
        const statusData = await botService.getStatus();
        setStatus(statusData.status || 'offline');

        if (statusData.status === 'running' || statusData.status === 'online') {
            const portfolioData = await botService.getPortfolio();
            setPortfolio(portfolioData);
            const profitData = await botService.getProfit();
            setProfit(profitData);
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
