import express from 'express'
import { getPosts, getPostsBySearch, getPostsByCreator, getPost, createPost, updatePost, likePost, commentPost, deletePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';
import responseTimeMiddleware from '../middleware/responseTimeMiddleware.js'
import {upload, compressImage } from '../middleware/compressImage.js';


const router = express.Router()

router.use(responseTimeMiddleware);

router.get('/creator', getPostsByCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', auth, upload.single('selectedFile'), compressImage, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);




export default router