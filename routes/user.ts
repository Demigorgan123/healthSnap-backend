// importing dependenicies
import express from 'express'
import { signupHandler, loginHandler } from '../controllers/user'

// creating routes for user
const router = express.Router()

// using router for signup/login
router.post('/signup', signupHandler);
router.get('/login', loginHandler)

// exporting the user routes
export default router