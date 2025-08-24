# Synth Pop Platform

A modern web application for discovering and managing synth pop bands, their music, and related content. This platform features a responsive frontend built with Vue 3, TypeScript, and Vite, powered by a Node.js/Express backend with MongoDB.

## ✨ Features

- 🎵 Browse and search synth pop bands
- 🎬 Watch music videos from your favorite artists
- 🎧 Listen to top synth pop tracks with the integrated music player
- 📱 Responsive design that works on all devices
- 🔒 User authentication and authorization
- 📝 Create and manage your own band profiles
- 🖼️ Upload and manage band images and media

## 🚀 Tech Stack

### Frontend
- Vue 3 with Composition API
- TypeScript
- Vite (Build tool)
- Pinia (State Management)
- Vue Router
- Axios (HTTP Client)
- SCSS (Styling)
- Vue Advanced Cropper (Image Editing)
- APlayer (Audio Player)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- File Uploads with Multer and Cloudinary
- CORS Support
- Request Validation with Joi
- Environment Configuration with dotenv

## 🛠️ Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image storage)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd synth-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=4000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd synth-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend root with the following variables:
   ```env
   VITE_APP_API_URL=http://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📂 Project Structure

### Frontend
```
synth-frontend/
├── public/               # Static files
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable Vue components
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── views/            # Page components
│   ├── App.vue           # Root Vue component
│   └── main.ts           # Application entry point
└── ...
```

### Backend
```
synth-backend/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/              # Mongoose models
├── routes/              # API routes
├── uploads/             # Uploaded files (temporary)
├── validations/         # Request validations
├── index.ts             # Application entry point
└── ...
```

## 🛠️ Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type-check TypeScript files

### Backend
- `npm start` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All the amazing synth pop artists who inspire us
- The Vue.js and Node.js communities
- Open source contributors
