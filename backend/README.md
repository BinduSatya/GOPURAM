# Gopuram Backend Documentation

This backend powers the Gopuram app, providing RESTful APIs for authentication, user management, chat, and memories. It uses Node.js, Express, MongoDB (via Mongoose), JWT for authentication, and integrates with Cloudinary for media uploads. Real-time chat is powered by Socket.io.

---

## Folder Structure

- **src/**
  - **server.js**: Main Express server setup, CORS configuration, Socket.io, and route mounting.
  - **controllers/**: Route logic for authentication, users, chat, and memories.
  - **lib/**: Utility libraries (DB connection, Cloudinary).
  - **middleware/**: Custom Express middlewares (auth, multer for file uploads).
  - **models/**: Mongoose models for User, FriendRequest, Message, GopuramMessage, TripMemory.
  - **routes/**: Express route definitions for auth, user, chat, memories.
- **.env**: Environment variables (DB URI, JWT secret, API keys).

---

## Models

### 1. User Model ([src/models/User.model.js](src/models/User.model.js))

Defines the structure for user accounts.

- **Fields:**

  - `fullName` (String, required): User's full name.
  - `email` (String, required, unique): User's email address.
  - `password` (String, required, min 6 chars): Hashed password.
  - `bio` (String): Short biography.
  - `profilePic` (String): URL to profile picture.
  - `learningSkill` (String): User's skill or interest.
  - `location` (String): User's location.
  - `isOnboarded` (Boolean, default: false): Whether onboarding is complete.
  - `friends` (Array of ObjectId): References to other users (friend list).
  - **Timestamps:** Automatically adds `createdAt` and `updatedAt`.

- **Hooks & Methods:**
  - Password is hashed before saving using bcrypt.
  - `matchPassword(enteredPassword)`: Compares entered password with stored hash.

---

### 2. FriendRequest Model ([src/models/FriendRequest.model.js](src/models/FriendRequest.model.js))

Tracks friend requests between users.

- **Fields:**
  - `sender` (ObjectId, required): User sending the request.
  - `recipient` (ObjectId, required): User receiving the request.
  - `status` (String, enum: "pending", "accepted", default: "pending"): Request status.
  - **Timestamps:** Tracks creation and update times.

---

### 3. Message Model ([src/models/Message.model.js](src/models/Message.model.js))

Stores chat messages.

- **Fields:**
  - `senderId` (ObjectId, required): User sending the message.
  - `receiverId` (ObjectId, required): User receiving the message.
  - `text` (String): Message content.
  - `image` (String): Optional image URL.
  - **Timestamps:** Tracks when the message was sent.

---

### 4. GopuramMessage Model ([src/models/GopuramMessage.model.js](src/models/GopuramMessage.model.js))

Stores group or special "Gopuram" messages.

- **Fields:**
  - `senderId` (ObjectId, required): User sending the message.
  - `groupId` (ObjectId): Optional group reference.
  - `text` (String): Message content.
  - `image` (String): Optional image URL.
  - **Timestamps:** Tracks when the message was sent.

---

### 5. TripMemory Model ([src/models/TripMemory.model.js](src/models/TripMemory.model.js))

Stores user memories (e.g., trips).

- **Fields:**
  - `tripName` (String): Name of the trip.
  - `ownerName` (String): Name of the memory owner.
  - `date` (Date): Date of the memory.
  - `link` (String): Optional link (e.g., to photos).
  - `image` (String): Image URL.

---

## Routing

All routes are defined using Express routers and are grouped by functionality.

### Auth Routes ([src/routes/auth.route.js](src/routes/auth.route.js))

- `/api/auth/signup` (POST): Registers a new user.
- `/api/auth/login` (POST): Authenticates user, returns JWT cookie.
- `/api/auth/logout` (POST): Logs out user (clears JWT).
- `/api/auth/onboarding` (POST): Completes user profile (requires JWT).
- `/api/auth/me` (GET): Returns current user info (requires JWT).

### User Routes ([src/routes/user.route.js](src/routes/user.route.js))

- `/api/users/get-users` (GET): Get recommended users.
- `/api/users/get-user/:id` (GET): Get user by ID.
- `/api/users/incoming` (GET): Get incoming friend requests.
- `/api/users/outgoing` (GET): Get outgoing friend requests.
- `/api/users/friends` (GET): Get user's friends.
- `/api/users/friend-requests` (GET): Get all friend requests.
- `/api/users/outgoing-friend-requests` (GET): Get outgoing friend requests.
- `/api/users/friend-request/:id` (POST): Send friend request.
- `/api/users/friend-request/:id/accept` (PUT): Accept friend request.
- `/api/users/memories-form` (POST): Add a new memory.

### Chat Routes ([src/routes/chat.route.js](src/routes/chat.route.js))

- `/api/chat/:id` (GET): Get messages with a user.
- `/api/chat/send-message` (POST): Send a new message (supports image upload).
- `/api/chat/get-messages` (GET): Get messages (general endpoint).

### Memories Routes ([src/routes/memories.route.js](src/routes/memories.route.js))

- `/api/memories/all` (GET): Get all memories.
- `/api/memories/post-memory` (POST): Add a new memory (supports image upload).

---

## Controllers

Controllers contain the business logic for each route.

- **auth.controller.js**: Handles signup, login, logout, onboarding, and user info retrieval.
- **user.controller.js**: Handles user search, friend requests (send, accept, list), friends list, and recommended users.
- **chat.controller.js**: Handles message retrieval and sending, including image uploads and group messages.
- **memories.controller.js**: Handles creation and retrieval of trip memories, including image uploads.

Each controller validates input, interacts with models, and returns appropriate HTTP responses.

---

## Middleware

### Auth Middleware ([src/middleware/auth.middleware.js](src/middleware/auth.middleware.js))

- **protectRoute:**  
  Checks for JWT in cookies, verifies it, and attaches the user to `req.user`.  
  Returns 401 if not authenticated.
- Used on all protected routes to ensure only authenticated users can access sensitive endpoints.

### Multer Middleware ([src/middleware/multer.file.js](src/middleware/multer.file.js))

- **upload:**  
  Handles file uploads in memory for image processing (used for chat and memories).

---

## CORS Configuration

CORS (Cross-Origin Resource Sharing) is configured in `server.js` to allow requests from the frontend:

```js
import cors from "cors";
app.use(
  cors({
    origin: process.env.CORS, 
    credentials: true,
  })
);
```

- Ensures secure communication between frontend and backend, especially for authentication cookies.

---

## Lib Folder

Contains utility modules:

- **db.js:**  
  Connects to MongoDB using Mongoose. Uses URI from `.env`.
- **cloudinary.js:**  
  Configures Cloudinary for image uploads. Uses credentials from `.env`.

---

## Environment Variables

Set in `.env`:

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET_KEY`: JWT signing secret.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials.
- `PORT`: Server port.
- `CORS`: Allowed origins for CORS.

---

## Error Handling

- All controllers catch errors and return appropriate HTTP status and messages.
- Auth middleware returns 401 for unauthorized access.
- Validation errors and missing resources return 400/404 status codes.

---

## Real-Time Chat

- **Socket.io** is used for real-time messaging.
- Users are mapped to socket IDs for direct message delivery.
- Events:
  - `register-user`: Registers a user with their socket ID.
  - `send-message`: Sends a message to a specific user or group.
  - `recieved-message`: Notifies clients to fetch new messages.

---

## Deployment

- Vercel config in `vercel.json` for serverless deployment.
- Static files served from `/public`.
- Environment variables must be set in your deployment dashboard.

---

## How It Works

1. **User signs up or logs in**: JWT cookie is set.
2. **Protected routes**: Require JWT, checked by middleware.
3. **User can send/accept friend requests, chat, and create memories.**
4. **Media uploads**: Handled via Cloudinary.
5. **Real-time chat**: Socket.io used for instant message delivery.

---

## Extending

- Add more endpoints in `routes` and `controllers`.
- Add more fields to models as needed.
- Integrate more third-party services in `lib`.
- Enhance error handling and validation as needed.

---

## References

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)
- [Socket.io](https://socket.io/)
