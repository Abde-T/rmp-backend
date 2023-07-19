import express from 'express'
import { getPosts, getPostsBySearch, getAllPosts, getPostsByCreator, getPost, createPost, updatePost, likePost, commentPost, deletePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';
import responseTimeMiddleware from '../middleware/responseTimeMiddleware.js'

const router = express.Router()

router.get('/creator', getPostsByCreator);
router.get('/projects/search', getPostsBySearch);
router.get('/', responseTimeMiddleware, getPosts);
router.get('/projects', getAllPosts);
router.get('/:id',responseTimeMiddleware, getPost);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);


export default router