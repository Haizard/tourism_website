import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
        return res.status(500).json({ message: 'Admin credentials not configured on server' });
    }
    if (username === adminUser && password === adminPass) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
};
