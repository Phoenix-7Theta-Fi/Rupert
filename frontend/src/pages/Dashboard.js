import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/blogs/my-blogs');
      setBlogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5002/api/blogs/${blogId}`);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Practitioner Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
              <p className="text-gray-600 mb-4">
                Update your professional profile, bio, and availability schedule.
              </p>
              <Link
                to="/profile/edit"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Edit Profile
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Blog Management</h2>
              <p className="text-gray-600 mb-4">
                Create and manage your blog posts to share your knowledge.
              </p>
              <Link
                to="/create-blog"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create New Blog
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Blog Posts</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-500">
              You haven't created any blogs yet.
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <li key={blog._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                        <div className="flex space-x-3">
                          <Link
                            to={`/edit-blog/${blog._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{blog.summary}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>{blog.readTime} read</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
