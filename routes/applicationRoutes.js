const express=require('express');
const router=express.Router();
const applicationController=require('../controllers/applicationController');
const authenticateUser=require('../middlewaress/authUser');
const isApplicant=require('../middlewaress/checkApplicant');
router.post('/',authenticateUser,isApplicant,applicationController.applyToJob);
// router.put('/:id',authenticateUser,isRecruiter,jobController.update);
// router.delete('/:id',authenticateUser,isRecruiter,jobController.deleteJob);
// router.get('/',authenticateUser,jobController.getAll);
// router.get('/postedByRecruiter',authenticateUser,jobController.getJobsPostedByUser);
// router.get('/:id',authenticateUser,jobController.getOneJob);

module.exports=router;