const express = require('express')
const router = express.Router()
const blogController = require('../Controller/blogController')
const authorController = require('../Controller/authorController')
const middle = require('../middleware/allMiddleware')


router.post('/authors', authorController.createAuthor)

router.post('/blogs', middle.authentication , blogController.createBlog)

router.get('/getblogs',middle.authentication  ,blogController.getBlogs)

router.put('/blogs/:blogsId',middle.authentication, middle.deleteandUpdateBlogById,  blogController.updateBlog)

router.put('/deleteblogs/:blogsId', middle.authentication, middle.deleteandUpdateBlogById, blogController.deleteBlog)

router.put('/delete', middle.authentication, middle.deleteBlogbyParams,  blogController.deleteByParams)

router.post('/login', authorController.loginUser )


module.exports = router