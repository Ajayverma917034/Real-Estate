import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from '../firebase'
import { deleteUserFalilure, deleteUserStart, deleteUserSuccess, logOutUserFalilure, logOutUserStart, logOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import { deleteUser } from 'firebase/auth'
import {Link} from "react-router-dom"

const Profile = () => {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const {currentUser, loading, error} = useSelector(state => state.user)
  const[file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, serFileUploadError] = useState(false)
  const [updateSuccess, setupdateSuccess] = useState(false)
  const [formData, setFormData] = useState({})

    // firebase storage 
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')
  const handleFileUpload = (file) =>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshop)=>{
        const progress = (snapshop.bytesTransferred / snapshop.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
    (err) =>{
      serFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => {
        setFormData({...formData, avatar: downloadURL})
      })
    }
    )
    
  }
  const handleChage = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {method: 'POST', headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setupdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const deleteAccount = async()=>{
      try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`,{

            method: 'DELETE'
          })
          const data = await res.json();
          if(data.success === false){
            dispatch(deleteUserFalilure(error.message))
            return;
          }
          dispatch(deleteUserSuccess(data));
      } catch (error) {
          dispatch(deleteUserFalilure(error.message))
      }
  }

  const handlesignout = async()=>{
    try {
        dispatch(logOutUserStart())
        const res = await fetch('/api/auth/signout')  
        const data = await res.json();
        if(data.success === false){
          dispatch(logOutUserFalilure(data.message))
          return;
        }
        dispatch(logOutUserSuccess(data.message))
    } catch (error) {
      dispatch(logOutUserFalilure(error.message))
      // console.log(error)
    }
  }
  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  return (
     <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref ={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          { fileUploadError ? ( 
            <span className='text-red-700'> Error Image upload </span> 
            ) :  filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc} %`}</span>
            ) : filePerc === 100 ? ( 
              <span className='text-green-700'>Image successfully uploaded</span>
            ) : 
              ""
          }
        </p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' 
        defaultValue={currentUser.username}
        id='username' onChange={handleChage}/>
        <input type="text" placeholder='email' className='border p-3 rounded  -lg' 
        defaultValue={currentUser.email}
        id='email' onChange={handleChage}/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' 
        id='password' onChange={handleChage}/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>{loading ? "Loading..." : 'update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer ' onClick={deleteAccount}>Delete Account</span>
        <span onClick={handlesignout} className='text-red-700 cursor-pointer '>Sign out</span>
      </div>

      <p className='text-red-700 m-5'>{error ? error : ""}</p>
      <p className='text-green-700 m-5'>{updateSuccess ? "Profile updated successfully" : ""}</p>
    </div>
  )
}

export default Profile