const express=require('express');
const router=express.Router();
const adminController=require('../controllers/adminController');
const profileController=require('../controllers/profileController');
const authenticateAdmin=require('../middlewaress/checkAdmin');
router.post('/signIn',adminController.signInUser);
// All routes below require admin access
router.get('/users',authenticateAdmin,adminController.getAllUsers);
router.get('/users/:id',authenticateAdmin,profileController.getProfileForAdmin);
router.patch('/users/:id/status',authenticateAdmin,adminController.updateUserStatus);
// router.delete('/user/:id',authenticateAdmin,adminController.deleteUser);
router.get('/jobs',authenticateAdmin,adminController.getAllJobs);
router.patch('/jobs/:id/status',authenticateAdmin,adminController.toggleJobApproval);
router.delete('/jobs/:id',authenticateAdmin,adminController.deleteJob);
module.exports=router;