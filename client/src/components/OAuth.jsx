import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { useDispatch } from 'react-redux'
import { app } from '../firebase'
import {useNavigate} from "react-router-dom"
import { signInSuccess } from '../redux/user/userSlice'
const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async() =>{
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}), 

            })
            const data = await res.json()
            dispatch(signInSuccess(data));
            navigate('/')
        }catch(err){
            console.log('could not sign in with google', err)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 uppercase rounded-lg hover:opacity-95'>Continue with google</button>
  )
}

export default OAuth