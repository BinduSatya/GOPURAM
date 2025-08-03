# Gopuram App

Gopuram is a personalised full-stack social platform that enables users to chat, video call, store and share memories, and interact with friends. Built with React (frontend) and Node.js/Express (backend), it uses MongoDB for data storage, Socket.io for real-time communication, and integrates with Cloudinary and VideoSDK for media and video calling features.

---

## Features

- **Authentication**: Secure signup, login, and JWT-based session management.
- **Chat**: Real-time messaging between users using Socket.io.
- **Video Calling**: Integrated video chat powered by VideoSDK.
- **Memories**: Store and share trip memories with images and links.
- **Friend System**: Send, accept, and manage friend requests.
- **Profile Management**: Update bio, profile picture, skills, and location.
- **Responsive UI**: Built with React, Tailwind CSS and DaisyUI for modern look and feel.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query, Zustand, Socket.io-client, Axios, React Router
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Socket.io, Cloudinary, VideoSDK
- **Deployment**: Railway is used for deployment

---

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)
- VideoSDK for video calls

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/gopuram.git
cd gopuram
```

### 2. Setup Backend

```sh
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VIDEOSDK_API_KEY=your_videosdk_api_key
PORT=3000
```

Start the backend server:

```sh
npm run dev
```

### 3. Setup Frontend

```sh
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` with:

```
VITE_API_URL=http://localhost:3000/api/
```

Start the frontend server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. **Sign Up / Login**: Create an account or log in.
2. **Profile Onboarding**: Complete your profile with bio, skills, and profile picture.
3. **Find Friends**: Search for users and send friend requests.
4. **Chat & Video Call**: Start real-time chats or video calls with friends.
5. **Share Memories**: Add trip memories with images and links.
6. **Manage Friends**: Accept or decline friend requests, view your friends list.

---

## API Overview

- **Auth**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, `/api/auth/onboarding`
- **User**: `/api/users/get-users`, `/api/users/get-user/:id`, `/api/users/friends`, `/api/users/friend-request/:id`, `/api/users/friend-request/:id/accept`, `/api/users/memories-form`
- **Chat**: `/api/chat/:id`, `/api/chat/send-message`
- **Video**: `/api/video-calls`, VideoSDK library for video calling

---

## Real-Time Features

- **Socket.io** enables instant message delivery and notifications.
- **Video calls** use VideoSDK for secure, scalable video chat.

---

## Deployment

- **Frontend**: Deploy the `frontend/dist` folder to Vercel, Netlify, or similar.
- **Backend**: Deploy to Vercel (serverless), Heroku, or any Node server.
- **Environment Variables**: Set all secrets in your deployment dashboard.

---

## Credits

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [Socket.io](https://socket.io/)
- [Cloudinary](https://cloudinary.com/)
