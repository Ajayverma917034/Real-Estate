import express from 'express'
import { createLising } from '../controllers/listing.controller.js'
import { isAuthorized } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',isAuthorized, createLising)

export default router