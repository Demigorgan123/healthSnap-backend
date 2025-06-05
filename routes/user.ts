// importing dependenicies
import express from 'express'
import { signupHandler, loginHandler} from '../controllers/userAuth'
import symptomCheckHandler from '../controllers/symptomCheck'
import {createHealthLogHandler, getHealthLogHandler} from '../controllers/healthLog'
import verifyToken from '../middleware/verifyToken'
import upload from '../middleware/uploadProfilePic'

// creating routes for user
const router = express.Router()

// using router for signup/login
router.post('/signup', upload.single('profilePic'), signupHandler)
router.get('/login', loginHandler)
router.post('/symptomCheck', verifyToken, symptomCheckHandler)
router.post('/healthLog', verifyToken, createHealthLogHandler)
router.get('/healthLog', verifyToken, getHealthLogHandler)

// exporting the user routes
export default router