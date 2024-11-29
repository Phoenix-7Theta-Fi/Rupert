import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const BlogEditor = ({ isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [readTime, setReadTime] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (isEditing && id) {
      fetchBlog();
    }
  }, [isEditing, id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/blogs/${id}`);
      const blog = response.data;
      setTitle(blog.title);
      setContent(blog.content);
      setSummary(blog.summary);
      setReadTime(blog.readTime);
      if (blog.coverImage) {
        setCoverImagePreview(blog.coverImage);
      }
    } catch (error) {
      toast.error('Failed to fetch blog');
      navigate('/dashboard');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5002/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
      } catch (error) {
        toast.error('Failed to preview image');
      }
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            if (file) {
              try {
                const imageUrl = await handleImageUpload(file);
                const quill = this.quill;
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', imageUrl);
              } catch (error) {
                toast.error('Failed to upload image');
              }
            }
          };
        },
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl = coverImagePreview;
      if (coverImage) {
        coverImageUrl = await handleImageUpload(coverImage);
      }

      const blogData = {
        title,
        content,
        summary,
        readTime,
        coverImage: coverImageUrl,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5002/api/blogs/${id}`, blogData);
        toast.success('Blog updated successfully');
      } else {
        await axios.post('http://localhost:5002/api/blogs', blogData);
        toast.success('Blog created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update blog' : 'Failed to create blog');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
                Read Time (e.g., "5 min read")
              </label>
              <input
                type="text"
                id="readTime"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {coverImagePreview && (
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-96 mb-12"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
