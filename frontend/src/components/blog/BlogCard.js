import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{blog.readTime} min read</span>
        </div>
        <p className="text-gray-600 mb-4">
          {blog.summary || blog.content?.substring(0, 150)}...
        </p>
        <Link
          to={`/blogs/${blog._id}`}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
