const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');

router.post('/',authenticateUser,upload.single('imageUrl'),postController.createPost);
router.get('/',authenticateUser,postController.allPost);
router.get('/:id',authenticateUser,postController.getOnePost);
router.post('/:postId/like',authenticateUser,postController.toggleLike);

module.exports=router;