// importing dependencies
import { Request, Response } from 'express'
import userModel from '../models/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {signup, login} from '../interface/user'
import 'dotenv/config'
// signupHandler for creating new user
const signupHandler = async (req: Request<{}, {}, signup>, resp: Response) => {
    try {
        const { name, email, passwd, profilePic } = req.body
        const hashPasswd = await bcrypt.hash(passwd, 10)
        const result = await userModel.insertOne({
            name: name,
            email: email,
            passwd: hashPasswd,
            profilePic: profilePic
        })
        resp.status(201).json({
            message: "User register successfully",
            userId: result._id
        })
        return
    } catch (error: any) {
        if (error.code === 11000) {
            resp.status(409).json({ message: 'Email already exists.' })
            return
        }
        resp.status(500).json({ message: 'Server error during signup.' })
    }
}

// loginHandler for authenticating the user
const loginHandler = async (req: Request<{}, {}, login>, resp: Response) => {
    try {
        const { email, passwd } = req.body

        const user = await userModel.findOne({ email })
        if (!user){
            resp.status(404).json({ message: 'User not found' })
            return
        }

        const match = await bcrypt.compare(passwd, user!.passwd)
        if (!match){
            resp.status(401).json({ message: 'Incorrect password' })
            return
        }

        const jwtToken = jwt.sign({ email, passwd }, process.env.SECRET_KEY!, { expiresIn: '1h' })
        resp.cookie('access_token', jwtToken, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, prevents XSS attack
            secure: true,   // Ensures the cookie is only transmitted over HTTPS connections
            sameSite: 'strict', //  Prevents CSRF attacks. 
            expires: new Date(Date.now() + 3600000)
        })
        resp.status(200).json({
            message: 'Login successful',
            userId: user?._id,
        })
        return
    } catch (error) {
        resp.status(500).json({ message: 'Server error during login' })
        return
    }
}

// exporting the signup/login controller
export { signupHandler, loginHandler }