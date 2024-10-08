import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return next()
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded._id,
            email: decoded.email
        }

        return next();

    } catch(err) {
        res.clearCookie('auth');

        res.redirect('/auth/login')
    }
}