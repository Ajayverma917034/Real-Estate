import express from 'express'
import { test } from '../controllers/user.controller.js'

const UserRouter = express.Router()

UserRouter.get('/test', test)

export default UserRouter