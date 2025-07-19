const express=require('express');
const router=express.Router();
const jobController=require('../controllers/jobController');
const {jobValidation} = require('../middlewaress/validations');
const validateRequest=require('../middlewaress/validationRequest');
const authenticateUser=require('../middlewaress/authUser');
router.post('/',jobValidation,validateRequest,authenticateUser,jobController.create);
router.put('/:id',authenticateUser,jobController.update);
router.get('/',authenticateUser,jobController.getAll);
router.get('/postedByRecruiter',authenticateUser,jobController.getJobsPostedByUser);
router.get('/:id',authenticateUser,jobController.getOneJob);

module.exports=router;
