const express=require('express');
const router=express.Router();
const jobController=require('../controllers/jobController');
const {jobValidation} = require('../middlewaress/validations');
const validateRequest=require('../middlewaress/validationRequest');
const authenticateUser=require('../middlewaress/authUser');
router.post('/',jobValidation,validateRequest,authenticateUser,jobController.create);
// router.post('/signIn',signInValidation,validateRequest,authController.signInUser);
module.exports=router;
