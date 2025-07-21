const express=require('express');
const router=express.Router();
const jobController=require('../controllers/jobController');
const {jobValidation} = require('../middlewaress/validations');
const validateRequest=require('../middlewaress/validationRequest');
const authenticateUser=require('../middlewaress/authUser');
const isRecruiter=require('../middlewaress/checkRecruiter');
router.post('/',jobValidation,validateRequest,authenticateUser,isRecruiter,jobController.create);
router.put('/:id',authenticateUser,isRecruiter,jobController.update);
router.patch('/:id/status',authenticateUser,isRecruiter,jobController.changeStatus);
router.delete('/:id',authenticateUser,isRecruiter,jobController.deleteJob);
router.get('/',authenticateUser,jobController.getAll);
router.get('/postedByRecruiter',authenticateUser,jobController.getJobsPostedByUser);
router.get('/:id',authenticateUser,jobController.getOneJob);

module.exports=router;
