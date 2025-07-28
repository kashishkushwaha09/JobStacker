const express=require('express');
const router=express.Router();
const profileController=require('../controllers/profileController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');
const isRecruiter=require('../middlewaress/checkRecruiter');
router.patch('/applicant',authenticateUser,upload.fields([
   {name:'profilePicture',maxCount:1},
    {name:'resume',maxCount:1}
]),profileController.updateProfileApplicant);

router.patch('/recruiter',authenticateUser,upload.single('profilePicture'),profileController.updateProfileRecruiter);
router.delete('/',authenticateUser,profileController.deleteProfile);
router.get('/me',authenticateUser,profileController.myProfile);
router.get('/:id',authenticateUser,isRecruiter,profileController.getProfile);
router.get('/download-resume/:profileId',authenticateUser,isRecruiter,profileController.resumeDownload);
module.exports=router;