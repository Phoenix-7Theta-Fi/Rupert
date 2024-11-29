import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching blog post');
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Blog post not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{blog.readTime} min read</span>
        </div>
        {blog.summary && (
          <div className="text-gray-600 italic mb-6">
            {blog.summary}
          </div>
        )}
        <div 
          className="blog-content mb-12"
          dangerouslySetInnerHTML={{ __html: blog.richContent }}
        />

        {/* Author Section */}
        {blog.author && (
          <div className="border-t pt-8 mt-12">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">About the Author</h3>
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <h4 className="text-lg font-medium mb-2">
                    Dr. {blog.author.name}
                  </h4>
                  <div className="flex space-x-4">
                    <Link
                      to={`/practitioners/${blog.author._id}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/book-appointment/${blog.author._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
