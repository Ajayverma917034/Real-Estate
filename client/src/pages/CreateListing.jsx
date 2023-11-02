import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [uploadImageError, setUploadImageError] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData , setFormData] = useState({
        imageUrls: [],
    })
  
    const handleImageSubmit = (e) =>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7 ){
            setUploadImageError(false)
            setUploading(true)
            const promises = [];
            for(let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(urls),
                })
                setUploadImageError(false)
                setUploading(false)
            }).catch((err)=>{
                setUploadImageError("Image upload failed (2 mb max per image")
                setUploading(false)
            })
            
        }
        else{
            setUploadImageError('You can only upload 6 image per listing')
            setUploading(false)
        }

    }
    const storeImage = async(file) =>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app)
            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage,filename)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const process = (snapshot.bytesTransferred / snapshot.totalBytes)* 100;
                    console.log(`upload is ${process}% done`)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                }
            )
        })
    }
    const handleRemoveImage = (index)=>[
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
        })
    ]
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Crate a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>

                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>

                <input type="address" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>

                <div className="flex gap-6 flex-wrap">
                    <div className=" flex gap-2">
                        <input type="checkbox" id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>

                    <div className=" flex gap-2">
                        <input type="checkbox" id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id='parking' className='w-5'/>
                        <span>Parking spot</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="number" id='bedrooms' min={1} max={10} required className='p-3 border border-grey-300 rounded-lg'/>
                        <p>Beds</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="number" id='bathrooms' min={1} max={10} required className='p-3 border border-grey-300 rounded-lg'/>
                        <p>Baths</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="number" id='regularPrice' min={1} max={10} required className='p-3 border border-grey-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>(₹ / month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id='discountPrice' min={1} max={10} required className='p-3 border border-grey-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Discount Price</p>
                            <span className='text-xs'>(₹ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <p className='font-semibold '>Images:
                    <span className='font-normal text-gray-600 ml-2 '>The first will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled ={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                </div>
                <p className='text-red-700 mt-2 mb-2 text-sm'>{uploadImageError && uploadImageError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                        <div className="flex justify-between p-3 border items-center " key={index}>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                            <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 uppercase rounded-lg hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                 <button className='rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing
