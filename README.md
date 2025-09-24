# 🌍 Expedia Clone - Travel Booking Platform

A full-stack travel booking application inspired by Expedia, featuring comprehensive flight and hotel search, booking capabilities, and a robust dual authentication system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Firebase](https://img.shields.io/badge/firebase-9.23.0-orange.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

## 🎯 Project Overview

This travel booking platform provides users with a comprehensive solution for searching, comparing, and booking flights and hotels. The application features a modern React-based frontend with Firebase authentication, Redux state management, and a JSON server backend for data persistence.

### Key Highlights
- **Dual Authentication System**: Support for both email/password and phone number/OTP authentication
- **Real-time Search**: Dynamic flight and hotel search with filtering and sorting capabilities
- **Responsive Design**: Mobile-first approach with Chakra UI components
- **Admin Panel**: Complete administrative interface for managing bookings and inventory
- **Session Persistence**: Users stay logged in across browser sessions and page refreshes

## ✨ Features

### 🔐 Authentication & User Management
- **Email/Password Registration & Login** with Firebase Authentication
- **Phone Number/OTP Authentication** with SMS verification
- **Session Persistence** across browser refreshes and navigation
- **User Profile Management** with personal information storage
- **Secure Logout** with complete state cleanup

### 🛫 Flight Booking System
- **Flight Search** with origin, destination, and date selection
- **Real-time Results** with pricing and availability
- **Advanced Filtering** by price, duration, airlines, and stops
- **Sorting Options** by price, duration, and departure time
- **Booking Management** with confirmation and tracking

### 🏨 Hotel Booking System
- **Hotel Search** by location, check-in/out dates, and guests
- **Detailed Hotel Information** with photos, amenities, and reviews
- **Price Comparison** across different booking dates
- **Room Selection** with various accommodation options
- **Reservation Management** with booking confirmations

### 🛒 Shopping & Cart
- **Shopping Cart** for multiple bookings
- **Price Calculations** with taxes and fees
- **Booking Summary** with detailed itinerary
- **Payment Integration** ready for production deployment

### 👨‍💼 Admin Panel
- **Flight Management** - Add, edit, and remove flight listings
- **Hotel Management** - Manage hotel inventory and pricing
- **User Management** - View and manage registered users
- **Booking Analytics** - Track reservations and revenue
- **Content Management** - Update site content and offerings

### 🎨 User Experience
- **Responsive Design** optimized for all device sizes
- **Dark/Light Mode** toggle for user preference
- **Loading States** and error handling throughout the application
- **Search History** and saved preferences
- **Intuitive Navigation** with breadcrumbs and clear CTAs

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **Chakra UI 2.5.5** - Modular and accessible component library
- **Redux 4.2.1 + React-Redux 8.0.5** - State management
- **React Router DOM 6.10.0** - Client-side routing
- **Axios 1.3.4** - HTTP client for API communication
- **Framer Motion 10.10.0** - Animation library

### Authentication & Backend
- **Firebase 9.23.0** - Authentication, hosting, and real-time database
- **JSON Server 1.0.0** - RESTful API backend for development
- **Firebase Auth** - Email/password and phone number authentication
- **reCAPTCHA** - Bot protection for phone authentication

### Development Tools
- **React Scripts 5.0.1** - Build tools and development server
- **ESLint** - Code linting and formatting
- **React Testing Library** - Component testing
- **Create React App** - Project bootstrapping

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Authentication│    │   Backend       │
│   (React)       │◄──►│   (Firebase)    │    │   (JSON Server) │
│   Port: 3000    │    │                 │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Redux Store   │    │   Firebase Auth │    │   RESTful API   │
│   LocalStorage  │    │   SMS Gateway   │    │   User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **Authentication**: Firebase handles user authentication with email/password or phone/OTP
2. **State Management**: Redux manages application state with LocalStorage persistence
3. **API Communication**: Axios handles HTTP requests to JSON server backend
4. **Session Management**: Firebase auth state listener maintains user sessions

## 🚀 Installation

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/osanghvi1/Expedia-clone.git
cd Expedia-clone
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 4: Start Development Servers

**Terminal 1: Start JSON Server Backend**
```bash
npm run server
```
This starts the JSON server on `http://localhost:8080`

**Terminal 2: Start React Development Server**
```bash
npm start
```
This starts the React app on `http://localhost:3000`

### Step 5: Access the Application
Open your browser and navigate to `http://localhost:3000`

## 📖 Usage

### For Users
1. **Registration**: Create an account using email/password or phone number
2. **Search**: Look for flights or hotels using the search interface
3. **Filter & Sort**: Refine results using various filters and sorting options
4. **Book**: Add items to cart and complete the booking process
5. **Manage**: View and manage your bookings in the user dashboard

### For Administrators
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Inventory**: Add, edit, or remove flights and hotels
3. **User Management**: View registered users and their activities
4. **Analytics**: Monitor booking trends and revenue metrics

## 🔐 Authentication

### Email Authentication
- **Registration**: Email, password, and full name required
- **Login**: Email and password authentication via Firebase
- **Verification**: Email verification available for enhanced security

### Phone Authentication
- **Registration**: Phone number with SMS OTP verification
- **Login**: Phone number with OTP sent via Firebase SMS gateway
- **Security**: reCAPTCHA protection against automated attacks

### Session Management
- **Persistence**: User sessions persist across browser refreshes
- **Auto-restore**: Automatic session restoration from localStorage
- **Secure Logout**: Complete state cleanup on logout

## 🔌 API Endpoints

### User Management
- `GET /users` - Retrieve all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user account

### Flight Operations
- `GET /flight` - Get all flights
- `POST /flight` - Add new flight
- `PUT /flight/:id` - Update flight information
- `DELETE /flight/:id` - Remove flight

### Hotel Operations
- `GET /hotel` - Get all hotels
- `POST /hotel` - Add new hotel
- `PUT /hotel/:id` - Update hotel information
- `DELETE /hotel/:id` - Remove hotel

### Shopping Cart
- `GET /flightcart` - Get flight cart items
- `POST /flightcart` - Add flight to cart
- `GET /hotelcart` - Get hotel cart items
- `POST /hotelcart` - Add hotel to cart

## 🤝 Contributing

We welcome contributions to improve the Expedia Clone project! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain consistent code formatting with ESLint
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🚀 Deployment

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `build` folder.

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy from Git with continuous deployment
- **Firebase Hosting**: Use Firebase hosting for seamless integration
- **Heroku**: Deploy full-stack application with backend

### Environment Variables for Production
Ensure all Firebase configuration variables are properly set in your production environment.

## 📸 Screenshots

### Authentication System
![Authentication](https://user-images.githubusercontent.com/112754519/231046318-135d34cb-0ae7-46c3-851c-6889441c62de.PNG)
*Dual authentication with email/password and phone/OTP options*

### Hotel Search & Booking
![Hotels](https://user-images.githubusercontent.com/112754519/231046349-d9885d9f-b42d-4d9f-bfc2-0cac0f9a10df.PNG)
*Advanced hotel search with filtering and sorting capabilities*

### Flight Search & Booking
![Flights](https://user-images.githubusercontent.com/112754519/231046392-fea5d486-9b26-462c-af9a-5727853e6669.PNG)
*Comprehensive flight search with real-time results*

### Admin Dashboard
![Admin Panel](https://user-images.githubusercontent.com/112754519/231046415-c8c2f14c-f586-4da0-884a-992bc18b0e12.PNG)
*Complete administrative interface for inventory management*

## 🔄 Recent Updates

### Authentication Enhancements
- ✅ Fixed session persistence across page refreshes
- ✅ Implemented Firebase auth state listener
- ✅ Added comprehensive error handling for OTP authentication
- ✅ Improved reCAPTCHA management for phone verification
- ✅ Enhanced user feedback throughout authentication flows

### Code Quality Improvements
- ✅ Resolved 50+ ESLint warnings
- ✅ Fixed build compilation errors
- ✅ Updated deprecated dependencies
- ✅ Added comprehensive debugging and logging
- ✅ Improved error handling across components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Original Team Lead**: Kumkum
- **Team Members**: Ashish, Amit, Sagar Balsaraf, Sarim
- **Enhanced By**: Om Sanghvi - Authentication system improvements and documentation

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/osanghvi1/Expedia-clone/issues) section
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Expedia** for design inspiration
- **Firebase** for authentication services
- **Chakra UI** for the component library
- **React community** for excellent documentation and support

---

⭐ **Star this repository** if you found it helpful!

🔗 **Live Demo**: [https://expedia-clone-demo.vercel.app](https://interesting-stretch-8935-liart.vercel.app/)

📧 **Contact**: For any queries, reach out via GitHub issues or email.
