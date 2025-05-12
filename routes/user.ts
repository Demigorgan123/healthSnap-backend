// importing dependenicies
import express from 'express'
import { signupHandler, loginHandler, symptomCheckHandler } from '../controllers/user'
import verifyToken from '../middleware/verifyToken'

// creating routes for user
const router = express.Router()

// using router for signup/login
router.post('/signup', signupHandler)
router.get('/login', loginHandler)
router.post('/symptomCheck', verifyToken, symptomCheckHandler)

// exporting the user routes
export default router