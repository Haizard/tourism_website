import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};
