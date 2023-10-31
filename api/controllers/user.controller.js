import { ErrorHandler } from "../utils/Error.js"
import bcryptjs from 'bcryptjs'
import User from "../models/user.modal.js"
export const test = (req, res)=>{
    res.send("hello")
}

export const updateUser = async(req,res, next )=>{
    if(req.user.id !== req.params.id)
        return next(ErrorHandler(401, 'You can only update your account'))


    try {
        if(req.body.password){
            req.boly.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new: true}
        )

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const deleteUser = async(req, res, next)=>{
    try {
        if(req.user.id !== req.params.id)
        return next(ErrorHandler(401, "You can only delete your account."))
    
    await User.findByIdAndDelete(req.params.id)

    res.status(200).clearCookie('access_token').json('User has been deleted!')
} catch (error) {
    next(error)
    console.log(error) 
}
}