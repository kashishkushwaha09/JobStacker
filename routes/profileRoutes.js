const express=require('express');
const router=express.Router();
const profileController=require('../controllers/profileController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');

router.post('/applicant',authenticateUser,upload.fields([
   {name:'profilePicture',maxCount:1},
    {name:'resume',maxCount:1}
]),profileController.updateProfileApplicant);

router.post('/recruiter',authenticateUser,upload.single('profilePicture'),profileController.updateProfileRecruiter);
router.delete('/',authenticateUser,profileController.deleteProfile);
router.get('/:id',authenticateUser,profileController.getProfile);
module.exports=router;