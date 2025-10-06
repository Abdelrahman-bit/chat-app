import jwt from 'jsonwebtoken'
import createError from '../utils/createError.js';
import User from '../models/user.model.js';

export const protectedRoute = async (req, res, next) =>{
    const token = req.cookies.jwt;
    if(!token) throw createError('Unauthrized - NO token provided!', 401);

    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) throw createError("Unauthrized - NO token provided!", 401);

    const user = await User.findById(decoded.userId).select("-password");
    if(!user) throw createError('user not found', 404);

    req.user = user;
    next()
}