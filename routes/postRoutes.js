const express=require('express');
const router=express.Router();
const postController=require('../controllers/postController');
const { upload } = require('../middlewaress/fileUpload');
const authenticateUser=require('../middlewaress/authUser');

router.post('/',authenticateUser,upload.single('imageUrl'),postController.createPost);
router.put('/:postId',authenticateUser,upload.single('imageUrl'),postController.editPost);
router.delete('/:postId',authenticateUser,postController.deletePost);
router.get('/',authenticateUser,postController.allPost);
router.get('/:id',authenticateUser,postController.getOnePost);
router.post('/:postId/like',authenticateUser,postController.toggleLike);
router.post('/:postId/comment',authenticateUser,postController.addComment);
router.delete('/:postId/:commentId/comment',authenticateUser,postController.deleteComment);

module.exports=router;