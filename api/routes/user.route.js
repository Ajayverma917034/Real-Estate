import express from 'express'
import { test, updateUser } from '../controllers/user.controller.js'
import  {isAuthorized}  from '../utils/verifyUser.js'


const UserRouter = express.Router()

UserRouter.get('/test', test)
UserRouter.post('/update/:id',isAuthorized,  updateUser)

export default UserRouter