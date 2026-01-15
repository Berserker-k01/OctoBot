const API_BASE = '/api';

export const botService = {
    async getStatus() {
        try {
            const response = await fetch(`${API_BASE}/status`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching bot status:', error);
            return { status: 'offline', error: error.message };
        }
    },

    async startBot() {
        const response = await fetch(`${API_BASE}/bot/start`, { method: 'POST' });
        return response.json();
    },

    async stopBot() {
        const response = await fetch(`${API_BASE}/bot/stop`, { method: 'POST' });
        return response.json();
    },

    async getPortfolio() {
        try {
            const response = await fetch(`${API_BASE}/portfolio`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            return {};
        }
    },

    async getProfit() {
        try {
            const response = await fetch(`${API_BASE}/profitability`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching profit:', error);
            return {};
        }
    }
};
