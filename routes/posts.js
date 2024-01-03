import express from 'express'
import { getPosts, getPostsBySearch, getPostsByCreator, getPost, createPost, updatePost, likePost, commentPost, deletePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';
import responseTimeMiddleware from '../middleware/responseTimeMiddleware.js'
import {upload, compressImage } from '../middleware/compressImage.js';
// import { updateBase64ToCloudinary } from '../scripts/updateBase64ToCloudinary.js';

const router = express.Router()

router.use(responseTimeMiddleware);

router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

// router.get('/migrate-images', async (req, res) => {
//     try {
//       await updateBase64ToCloudinary();
//       res.status(200).json({ message: 'Migration successful' });
//     } catch (error) {
//       res.status(500).json({ message: 'Migration failed', error: error.message });
//     }
//   });

router.post('/', auth, upload.single('selectedFile'), compressImage, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);




export default router