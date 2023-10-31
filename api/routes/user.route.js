import express from 'express'
import { deleteUser, test, updateUser } from '../controllers/user.controller.js'
import  {isAuthorized}  from '../utils/verifyUser.js'


const UserRouter = express.Router()

UserRouter.get('/test', test)
UserRouter.post('/update/:id',isAuthorized,  updateUser)
UserRouter.delete('/delete/:id',isAuthorized,  deleteUser)

export default UserRouter