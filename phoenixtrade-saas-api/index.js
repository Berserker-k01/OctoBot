const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('PhoenixTrade SaaS API Running'));

// Database Connection
const sequelize = new Sequelize(
    process.env.DB_NAME || 'phoenix_db',
    process.env.DB_USER || 'phoenix',
    process.env.DB_PASS || 'password',
    {
        host: process.env.DB_HOST || 'postgres',
        dialect: 'postgres',
    }
);

// User Model
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    plan: { type: DataTypes.STRING, defaultValue: 'free' },
    status: { type: DataTypes.STRING, defaultValue: 'active' } // active, pending, suspended
});

// Sync DB
sequelize.sync().then(async () => {
    console.log('DB Synced');
    // Seed Admin User
    try {
        const adminEmail = 'admin@phoenixtrade.com';
        const adminUser = await User.findOne({ where: { email: adminEmail } });
        const hashedPassword = await bcrypt.hash('admin123', 10);

        if (!adminUser) {
            await User.create({
                email: adminEmail,
                password: hashedPassword,
                plan: 'pro',
                status: 'active'
            });
            console.log('Admin user created');
        } else {
            // Force reset password to ensure access
            adminUser.password = hashedPassword;
            await adminUser.save();
            console.log('Admin password reset to default');
        }
    } catch (e) {
        console.error('Seeding error:', e);
    }
});

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Routes
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
        res.json({ token, user: { id: user.id, email: user.email, plan: user.plan } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/profile', async (req, res) => {
    // Simple auth check middleware placeholder
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id);
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`SaaS API running on port ${PORT}`));
