// importing dependencies
import { Request, Response } from 'express'
import userModel from '../models/users'
import symptomChecksModel from '../models/symptomCheck'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { signup, login, decodeUser } from '../interface/user'
import 'dotenv/config'
import googleGenAI from '../service/gemini'
import mongoose from 'mongoose'
// signupHandler for creating new user
const signupHandler = async (req: Request<{}, {}, signup>, resp: Response) => {
    try {
        const { name, email, passwd, profilePic } = req.body
        if(!name || !email || !passwd){
            resp.status(400).json({message: 'Username, email, password is required'})
            return
        }
        const hashPasswd = await bcrypt.hash(passwd, 10)
        const result = await userModel.insertOne({
            name: name,
            email: email,
            passwd: hashPasswd,
            profilePic: profilePic
        })

        if(!result){
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
    }
}

// loginHandler for authenticating the user
const loginHandler = async (req: Request<{}, {}, login>, resp: Response) => {
    try {
        const { email, passwd } = req.body
        if(!email || !passwd){
            resp.status(400).json({message: "Email, password is required"})
            return
        }
        
        const user = await userModel.findOne({ email })
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

const symptomCheckHandler = async (req: Request & { user?: decodeUser }, resp: Response) => {
    try {
        const { userInput } = req.body
        if (!userInput) {
            resp.status(400).json({ message: 'Missing or Invalid input' })
            return
        }

        const user = req.user
        if (!user) {
            resp.status(401).json({ message: 'Unauthorized: Invalid user data in token.' })
            return
        }

        const aiResp = await googleGenAI(userInput)
        if (!aiResp) {
            resp.status(500).json({ message: 'AI service did not responed' })
            return
        }

        if(
            aiResp.text?.includes("I can only provide information related to health and medical symptoms.")
        ){
            resp.status(200).json({
                message: "I can only provide information related to health and medical symptoms."
            })
            return
        }
        const userId = new mongoose.Types.ObjectId(user.userId)

        const result = await symptomChecksModel.insertOne({
            userId: userId,
            userInput: userInput,
            AIResposne: aiResp.text
        })
        if(!result){
            resp.status(500).json({ message: 'Failed to create user symptoms. Please try again.' });
            return
        }
        resp.status(201).json({
            message: "User symptoms register successfully",
            AIResponse: aiResp,
            symptomsCheckId: result._id
        })
        return 
    } catch (error) {
        resp.status(500).json({ message: 'Internal server error'})
        return
    }
}
// exporting the signup/login controller
export { signupHandler, loginHandler, symptomCheckHandler }