import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-green-800 mb-6">
            Welcome to Drisht
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with experienced Ayurvedic practitioners and discover ancient wisdom for modern wellness
          </p>
          <div className="space-x-6">
            <Link
              to="/practitioners"
              className="bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Find a Practitioner
            </Link>
            <Link
              to="/blogs"
              className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors duration-300"
            >
              Read Blogs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">Expert Practitioners</h3>
            <p className="text-gray-600">Connect with verified Ayurvedic doctors who bring years of experience and deep knowledge of traditional healing practices.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">Insightful Content</h3>
            <p className="text-gray-600">Explore our collection of articles and insights about Ayurvedic practices, remedies, and lifestyle recommendations.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">Easy Booking</h3>
            <p className="text-gray-600">Schedule appointments with your preferred practitioners through our simple and efficient booking system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
