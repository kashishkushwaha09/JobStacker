const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const { signUpValidation, signInValidation } = require('../middlewaress/validations');
const validateRequest=require('../middlewaress/validationRequest');
router.post('/signup',signUpValidation,validateRequest,authController.signUpUser);
router.post('/signIn',signInValidation,validateRequest,authController.signInUser);
module.exports=router;