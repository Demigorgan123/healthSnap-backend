import { NextFunction, Request, Response } from 'express'
import { decodeUser } from '../interface/user';
import jwt from 'jsonwebtoken'
import 'dotenv/config'


const verifyToken = (req: Request & {user?:decodeUser}, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' })
        return
    }

    jwt.verify(token, process.env.SECRET_KEY!, (err: any, user: any) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token.' })
            return
        }
        req.user = user
        next()
    });
};

export default verifyToken