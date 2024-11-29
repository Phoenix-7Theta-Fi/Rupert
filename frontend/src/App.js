import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Practitioners from './pages/Practitioners';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import BlogEditor from './components/blog/BlogEditor';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAppointments from './pages/MyAppointments';
import PractitionerAppointments from './pages/PractitionerAppointments';
import BlogPost from './pages/BlogPost';
import PractitionerProfile from './pages/PractitionerProfile';
import PractitionerProfileEdit from './components/profile/PractitionerProfileEdit';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/practitioners" element={<Practitioners />} />
            <Route path="/practitioners/:id" element={<PractitionerProfile />} />
            <Route path="/book-appointment/:id" element={<BookAppointment />} />
            <Route path="/profile/edit" element={<PractitionerProfileEdit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-blog" element={<BlogEditor />} />
            <Route path="/edit-blog/:id" element={<BlogEditor isEditing />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/practitioner-appointments" element={<PractitionerAppointments />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
