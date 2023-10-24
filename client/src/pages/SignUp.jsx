import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import OAuth from '../components/OAuth'
const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (e)=>{
    setFormData({
      ...formData, [e.target.id]: e.target.value,
    })
  }
  console.log(formData)
  const handleOnsubmit =async(e) =>{
    e.preventDefault();
    try {
        setLoading(true)
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
        if(data.success === false){
          setError(data.message)
          setLoading(false)
          return;
        }
        setLoading(false)
        setError(null)
        navigate('/sign-in')
      
    } catch (error) {
      setLoading(false)
      setError(error.message)
      console.log("hello")
      
    }
    // console.log(data)
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleOnsubmit}>
        <input type="text" placeholder='Username' className='border p-3 rounder-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Email' className='border p-3 rounder-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounder-lg' id='password' onChange={handleChange}/>
        <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' onClick={handleOnsubmit}>{loading ? 'Loading...' : 'Sign up' }</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}> <span className='text-blue-700'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp