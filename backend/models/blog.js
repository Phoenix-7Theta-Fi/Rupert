const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  richContent: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: null
  },
  readTime: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
