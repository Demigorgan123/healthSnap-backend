// importing dependencies
import { Request, Response } from 'express'
import userModel from '../models/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { iSignup, iLogin } from '../interface/user'
import 'dotenv/config'
import uploadOnCloudinary from '../service/uploadCloudinary'
import fs from 'fs'
// signupHandler for creating new user
const signupHandler = async (req: Request<{}, {}, iSignup>, resp: Response) => {
    try {
        const { name, email, passwd } = req.body
        if (!name || !email || !passwd) {
            resp.status(400).json({ message: 'Username, email, password is required' })
            return
        }

        const hashPasswd = await bcrypt.hash(passwd, 10)

        let profilePic: string | undefined
        if (req.file) {
            const uploadRes = await uploadOnCloudinary(`./uploads/${req.file?.filename}`)
            if (!uploadRes) {
                resp.status(400).json({ message: 'Failed to upload profile pic' })
                return
            }
            profilePic = uploadRes.secure_url;
            fs.unlink(`./uploads/${req.file?.filename}`, (err)=>{
                if(err){
                    console.log(err)
                    return
                }
                console.log('profile pic deleted successfully')
            })
        }
        const result = await userModel.insertOne({
            name: name,
            email: email,
            passwd: hashPasswd,
            profilePic: profilePic
        })

        if (!result) {
            resp.status(500).json({ message: 'Failed to create user. Please try again.' })
            return
        }

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
        return
    }
}

// loginHandler for authenticating the user
const loginHandler = async (req: Request<{}, {}, iLogin>, resp: Response) => {
    try {
        const { email, passwd } = req.body
        if (!email || !passwd) {
            resp.status(400).json({ message: "Email, password is required" })
            return
        }

        const user = await userModel.findOne({ email: email })
        if (!user) {
            resp.status(404).json({ message: 'User not found' })
            return
        }

        const match = await bcrypt.compare(passwd, user!.passwd)
        if (!match) {
            resp.status(401).json({ message: 'Incorrect password' })
            return
        }
        const userId = user._id
        const userEmail = user.email
        const jwtToken = jwt.sign({ userId, userEmail }, process.env.SECRET_KEY!, { expiresIn: '1h' })
        resp.cookie('access_token', jwtToken, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript, prevents XSS attack
            secure: true,   // Ensures the cookie is only transmitted over HTTPS connections
            sameSite: 'strict', //  Prevents CSRF attacks. 
            expires: new Date(Date.now() + 3600000)
        })
        resp.status(200).json({
            message: 'Login successful',
            userId: userId,
        })
        return
    } catch (error) {
        resp.status(500).json({ message: 'Server error during login' })
        return
    }
}

// exporting the signup/login controller
export { signupHandler, loginHandler }