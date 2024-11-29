import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogEditor = ({ blog, isEditing }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    content: blog?.content || '',
    richContent: blog?.richContent || '',
    readTime: blog?.readTime || '',
    summary: blog?.summary || '',
    tags: blog?.tags?.join(', ') || ''
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRichContentChange = (content) => {
    setFormData({
      ...formData,
      richContent: content,
      content: content.replace(/<[^>]+>/g, '') // Strip HTML for plain text content
    });
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.richContent) {
        toast.error('Please add some content to your blog post');
        return;
      }

      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      if (isEditing) {
        await axios.patch(`http://localhost:5002/api/blogs/${blog._id}`, blogData, config);
        toast.success('Blog updated successfully!');
      } else {
        await axios.post('http://localhost:5002/api/blogs', blogData, config);
        toast.success('Blog created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error('Error details:', error.response?.data);
    }
  };

  if (!user || user.role !== 'practitioner') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">This page is only accessible to practitioners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <input
            type="text"
            name="summary"
            id="summary"
            required
            value={formData.summary}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <ReactQuill
            value={formData.richContent}
            onChange={handleRichContentChange}
            modules={modules}
            className="h-64 mb-12"
          />
        </div>

        <div>
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
            Read Time (e.g., "5 min")
          </label>
          <input
            type="text"
            name="readTime"
            id="readTime"
            required
            value={formData.readTime}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="ayurveda, wellness, health"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
