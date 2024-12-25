import jwt from 'jsonwebtoken'

const jwtAutoMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({ error: 'Unauthorized'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error : 'Invalid token'})
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData ,  process.env.JWT_SECRET , { expiresIn: '1h' });
}

export {generateToken , jwtAutoMiddleware};