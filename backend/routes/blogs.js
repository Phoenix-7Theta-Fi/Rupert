const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const auth = require('../middleware/auth');
const { isPractitioner } = require('../middleware/roles');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog (practitioners only)
router.post('/', auth, isPractitioner, async (req, res) => {
  try {
    const { title, content, richContent, readTime, summary, tags } = req.body;
    
    // Validate required fields
    if (!richContent) {
      return res.status(400).json({ message: 'Rich content is required' });
    }

    const blog = new Blog({
      title,
      content: content || richContent.replace(/<[^>]+>/g, ''), // Fallback to stripped richContent if content not provided
      richContent,
      readTime,
      summary,
      tags,
      author: req.user.id
    });

    const savedBlog = await blog.save();
    await savedBlog.populate('author', 'name');
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .lean();
      
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get practitioner's blogs
router.get('/my-blogs', auth, isPractitioner, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blog
router.patch('/:id', auth, isPractitioner, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    Object.keys(req.body).forEach(key => {
      blog[key] = req.body[key];
    });
    
    await blog.save();
    await blog.populate('author', 'name');
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete blog
router.delete('/:id', auth, isPractitioner, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user.id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
