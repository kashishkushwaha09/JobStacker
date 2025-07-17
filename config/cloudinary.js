const cloudinary = require('cloudinary').v2;
const { AppError } = require('../utils/appError');


 // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME, 
        api_key:process.env.CLOUDINARY_APIKEY, 
        api_secret:process.env.CLOUDINARY_APISECRET // Click 'View API Keys' above to copy your API secret
    });
async function uploadToCloudinary(fileURI,fileType = 'auto', publicId = null) {
        try {
             // Upload an image
     const result= await cloudinary.uploader
       .upload(
           fileURI, {
               folder: 'user_uploads',
               resource_type:fileType,
               public_id:publicId || undefined,
           }
       );
   
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    const rawfileUrl = cloudinary.url(result.public_id, {
  resource_type: 'raw',
  flags: 'attachment:false',
  folder: 'user_uploads',
});

  
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(result.public_id, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
     
    return {result,rawfileUrl}; 
        } catch (error) {
            console.log(error);
             throw new AppError('Cloudinary upload failed',500);
        }
   
}
module.exports={uploadToCloudinary};