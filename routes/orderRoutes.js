const express=require('express');
const router=express.Router();
const authenticateUser=require('../middlewaress/authUser');
const orderController=require('../controllers/orderController');
router.post('/create-order',authenticateUser,orderController.createOrder);
router.post('/verify-payment',authenticateUser,orderController.verifyPayment);
// router.post('/signIn',signInValidation,validateRequest,authController.signInUser);
module.exports=router;