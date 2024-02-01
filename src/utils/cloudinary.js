import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

const uploadOnCloudinary = async(localFilePath) => {
    if(!localFilePath) return null;
    try {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
            media_metadata: true
        })
        fs.unlinkSync(localFilePath)
        console.log(response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log('Error Uploading on Cloudinary')
    }
}

export default uploadOnCloudinary