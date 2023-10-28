import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from '../firebase'

const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser} = useSelector(state => state.user)
  const[file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, serFileUploadError] = useState(false)
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
      <form className='flex flex-col gap-4'>
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
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input type="text" placeholder='email' className='border p-3 rounded  -lg' id='email'/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer '>Delete Account</span>
        <span className='text-red-700 cursor-pointer '>Sign out</span>
      </div>
    </div>
  )
}

export default Profile