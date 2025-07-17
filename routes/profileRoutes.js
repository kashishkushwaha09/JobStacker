const express=require('express');
const router=express.Router();
const profileController=require('../controllers/profileController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');
// const {} = require('../middlewaress/validations');
// const validateRequest=require('../middlewaress/validationRequest');
router.post('/applicant',authenticateUser,upload.fields([
   {name:'profilePicture',maxCount:1},
    {name:'resume',maxCount:1}
]),profileController.updateProfileApplicant);
// router.post('/recruiter',signInValidation,validateRequest,authController.signInUser);
module.exports=router;