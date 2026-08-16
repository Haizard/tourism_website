import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUser || !adminPass) {
        return res.status(500).json({ message: 'Admin credentials not configured on server. Set ADMIN_USERNAME and ADMIN_PASSWORD in the server environment.' });
    }
    if (username !== adminUser || password !== adminPass) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT_SECRET not configured on server. Set JWT_SECRET in the server environment.' });
    }
    try {
        const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Login token signing failed:', error.message);
        return res.status(500).json({ message: 'Failed to generate login token. Please try again.' });
    }
};
