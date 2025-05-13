import { Request, Response } from "express"
import mongoose from "mongoose"
import { iUserInput, iDecodeUser } from "../interface/user"
import googleGenAI from "../service/gemini"
import symptomChecksModel from "../models/symptomCheck"
const symptomCheckHandler = async (req: Request<{}, {}, iUserInput> & { user?: iDecodeUser }, resp: Response) => {
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

        if (
            aiResp.text?.includes("I can only provide information related to health and medical symptoms.")
        ) {
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
        if (!result) {
            resp.status(500).json({ message: 'Failed to create user symptoms. Please try again.' });
            return
        }
        resp.status(201).json({
            message: "User symptoms register successfully",
            AIResponse: aiResp.text,
            symptomsCheckId: result._id
        })
        return
    } catch (error) {
        resp.status(500).json({ message: 'Internal server error' })
        return
    }
}

export default symptomCheckHandler