import { Request, Response } from "express"
import mongoose from "mongoose"
import { iHealthLog, iDecodeUser } from "../interface/user"
import healthLogModel from "../models/healthLogs"

const createHealthLogHandler = async (req: Request<{}, {}, iHealthLog> & { user?: iDecodeUser }, resp: Response) => {
    try {
        const userHealthLog = req.body
        if (!userHealthLog || !userHealthLog.mood || !userHealthLog.energyLvl) {
            resp.status(400).json({ message: "Health Logs are missing" })
            return
        }

        const user = req.user
        if (!user) {
            resp.status(401).json({ message: 'Unauthorized: Invalid user data in token.' })
            return
        }

        const userId = new mongoose.Types.ObjectId(user.userId)
        const result = await healthLogModel.insertOne({
            userId: userId,
            ...userHealthLog
        })

        if (!result) {
            resp.status(500).json({ message: 'Failed to create user health logs. Please try again.' });
            return
        }

        resp.status(201).json({
            message: "User health log created successfully",
            healthLogId: result._id
        })
        return
    } catch (error) {
        resp.status(500).json({ message: 'Internal server error' })
        return
    }
}

const getHealthLogHandler = async (req: Request & { user?: iDecodeUser }, resp: Response) => {
    try {
        const user = req.user
        if (!user) {
            resp.status(401).json({ message: 'Unauthorized: Invalid user data in token.' })
            return
        }
        const userId = new mongoose.Types.ObjectId(user?.userId)

        const healthLog = await healthLogModel.find({ userId: userId })
        if (!healthLog) {
            resp.status(404).json({ message: 'User health log not found' })
            return
        }

        resp.status(200).json({
            message: "Found user health logs successfully",
            healthLog: healthLog
        })
        return
    } catch (error) {
        resp.status(500).json({ message: 'Internal server error' })
        return
    }
}
export { createHealthLogHandler, getHealthLogHandler }