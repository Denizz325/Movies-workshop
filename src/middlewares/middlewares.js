import jwt from '../lib/jwt.js'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return next()
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = {
            _id: decoded._id,
            email: decoded.email
        }

        req.user = user;
        req.isAuthenticated = true
        res.locals.userId = user._id;
        res.locals.userEmail = user.email;
        res.locals.isAuthenticated = true;


        return next();

    } catch(err) {
        res.clearCookie('auth');

        res.redirect('/auth/login')
    }
}

export const isAuth = (req, res, next) => {
    if (!req.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    
    return next();
}