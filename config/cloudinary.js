const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadToCloudinary = async (buffer, folder, publicIdWithExt) => {
  const extension = publicIdWithExt.split(".").pop(); // e.g. "png"
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // e.g. "avatar"

  const uploadOptions = {
    resource_type: "image",
    folder,
    public_id: publicId,
    format: extension,
    type: "upload", // public asset
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
