import React from 'react';

const BlogCard = ({ title, author, content, createdAt, readTime }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <span>{author?.name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{readTime} read</span>
        </div>
        <p className="text-gray-600 line-clamp-3">{content}</p>
        <button className="mt-4 text-green-700 hover:text-green-900 font-medium">
          Read More →
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
