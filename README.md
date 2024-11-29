# Rupert - Holistic Healthcare Platform

Rupert is a modern web application that connects patients with holistic healthcare practitioners. The platform facilitates appointment booking, practitioner profile management, and health-related content sharing through blog posts.

## Features

### For Patients
- Browse and search for holistic healthcare practitioners
- View detailed practitioner profiles including specialties, experience, and education
- Book appointments with preferred practitioners
- Read health and wellness blog posts
- Manage appointments and view booking history

### For Practitioners
- Create and manage professional profiles
- Set availability and consultation fees
- Write and publish blog posts
- Manage appointment schedules
- Interact with patients through the platform

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React-toastify for notifications
- Modern UI/UX with responsive design

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- RESTful API architecture
- Middleware for role-based access control

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Rupert
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5002
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Seed the database with sample data (optional):
```bash
cd scripts
node seed-data.js
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Practitioners
- GET `/api/practitioners` - List all practitioners
- GET `/api/practitioners/:id` - Get practitioner details
- PUT `/api/practitioners/profile` - Update practitioner profile

### Appointments
- POST `/api/appointments` - Create new appointment
- GET `/api/appointments` - List user's appointments
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

### Blogs
- POST `/api/blogs` - Create new blog post
- GET `/api/blogs` - List all blog posts
- GET `/api/blogs/:id` - Get blog post details
- PUT `/api/blogs/:id` - Update blog post
- DELETE `/api/blogs/:id` - Delete blog post

## Sample Data

The application comes with seed data including:

### Practitioners
1. Dr. Elijah Anderson
   - Specialties: Holistic Medicine, Stress Management, Nutritional Therapy
   - Experience: 15 years
   - Available: Monday, Wednesday, Friday

2. Dr. Thomas Quipp
   - Specialties: Naturopathic Medicine, Functional Nutrition, Herbal Medicine
   - Experience: 12 years
   - Available: Tuesday, Thursday, Saturday

Each practitioner has 5 blog posts covering various health and wellness topics.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape Rupert
- Special thanks to the holistic healthcare community for their input and support
