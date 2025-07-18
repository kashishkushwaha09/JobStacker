const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');

router.post('/',authenticateUser,upload.single('imageUrl'),postController.createPost);

// router.post('/recruiter',authenticateUser,upload.single('profilePicture'),profileController.updateProfileRecruiter);
// router.delete('/',authenticateUser,profileController.deleteProfile);
// router.get('/:id',authenticateUser,profileController.getProfile);
module.exports=router;