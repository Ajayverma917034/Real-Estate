import User from "../models/user.modal.js";
import bcryptjs from "bcryptjs"
import { ErrorHandler } from "../utils/Error.js";
import jwt from "jsonwebtoken"
export const signup = async (req, res, next)=>{
    
    const {username, email, password} = req.body;
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save()
        res.status(201).json({success: true, message: 'User Created successfully'})
        
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next)=>{
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(ErrorHandler(404, 'User not found!'))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword)
            return next(ErrorHandler(401, 'Wrong Credentials'))
        
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    } catch (err) {
        next(err) 
    }
} 

export const google = async(req, res, next)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const {password: pass, ...rest} = user._doc
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
        else{
            const genereratedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(genereratedPassword, 10)
            const newUsername = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({username : newUsername,password: hashedPassword, email: req.body.email, avatar: req.body.photo})
            await newUser.save()
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const {password: pass, ...rest} = newUser;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
    }catch(err){
        console.log(err)
        next(err)
    }
}

export const signOut = async(req, res, next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged Out!')
    } catch (error) {
        next(error)
    }
}