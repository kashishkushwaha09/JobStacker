const express=require('express');
const router=express.Router();
const profileController=require('../controllers/profileController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');

router.patch('/applicant',authenticateUser,upload.fields([
   {name:'profilePicture',maxCount:1},
    {name:'resume',maxCount:1}
]),profileController.updateProfileApplicant);

router.patch('/recruiter',authenticateUser,upload.single('profilePicture'),profileController.updateProfileRecruiter);
router.delete('/',authenticateUser,profileController.deleteProfile);
router.get('/me',authenticateUser,profileController.myProfile);
router.get('/:id',authenticateUser,profileController.getProfile);
module.exports=router;