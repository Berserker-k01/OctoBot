import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check } from 'lucide-react';

const plans = [
    { id: '30_days', name: 'Starting', duration: '30 Days', price: '$29', features: ['Basic Strategies', 'Community Support'] },
    { id: '90_days', name: 'Pro', duration: '90 Days', price: '$79', features: ['Advanced Strategies', 'Priority Support', 'Access to Beta'] },
    { id: '365_days', name: 'Elite', duration: '365 Days', price: '$249', features: ['All Features', '1-on-1 Onboarding', 'Custom Strategies'] },
];

export default function Subscription() {
    const { currentUser } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-cyan-400">Select Your Plan</h1>
                    <p className="mt-4 text-gray-400">Choose the best plan to automate your trading with PhoenixTrade.</p>
                </header>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-1 ${selectedPlan === plan.id ? 'border-cyan-400 bg-slate-800' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <span className="text-lg font-bold text-cyan-400">{plan.price}</span>
                            </div>
                            <div className="text-gray-400 text-sm mb-6">{plan.duration}</div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm">
                                        <Check size={16} className="text-green-400 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full py-2 rounded font-bold transition ${selectedPlan === plan.id ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                            >
                                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                {selectedPlan && (
                    <div className="mt-12 bg-slate-800 p-8 rounded-lg border border-slate-700 animate-fade-in">
                        <h3 className="text-2xl font-bold mb-6">Complete Payment</h3>
                        <p className="mb-4 text-gray-300">Please send the exact amount to one of the following addresses:</p>
                        <div className="bg-slate-900 p-4 rounded mb-6 font-mono text-sm text-gray-400">
                            <p>BTC: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
                            <p>USDT (TRC20): T9yD14Nj9j7xAB4dbGeiX9h8zzfX</p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-300">Upload Payment Proof (Screenshot)</label>
                            <input type="file" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-slate-900 hover:file:bg-cyan-300" />
                            <button className="px-6 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-400">Submit for Validation</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
