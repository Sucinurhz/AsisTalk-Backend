const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const asishubAuth = require('../middleware/asishub.middleware');

const {
  createPost,
  getPosts,
  updatePost,
  deletePost
} = require('../controllers/post.controller');

// CREATE POST
router.post(
  '/',
  asishubAuth,
  upload.single('media'),
  createPost
);

// GET POSTS
router.get('/', getPosts);

// UPDATE POST
router.put('/:id', asishubAuth, upload.single('media'), updatePost);

// DELETE POST
router.delete('/:id', asishubAuth, deletePost);

module.exports = router;
