const multer=require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 9 * 1024 * 1024, // 10 MB limit
  },
});

  module.exports= { upload };