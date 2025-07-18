# Backend Documentation

This backend powers the Gopuram app, providing RESTful APIs for authentication, user management, chat, and memories. It uses Node.js, Express, MongoDB (via Mongoose), JWT for authentication, and integrates with Stream and Cloudinary for chat and media.

---

## Folder Structure

- **src/**
  - **server.js**: Main Express server setup and route mounting.
  - **controllers/**: Route logic for authentication, users, and chat.
  - **lib/**: Utility libraries (DB connection, Cloudinary, Stream).
  - **middleware/**: Custom Express middlewares (auth).
  - **models/**: Mongoose models for User, FriendRequest, Message, TripMemory.
  - **routes/**: Express route definitions for auth, user, chat.
- **.env**: Environment variables (DB URI, JWT secret, API keys).
- **vercel.json**: Vercel deployment config.

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

### 3. Message Model ([src/models/Messge.model.js](src/models/Messge.model.js))

Stores chat messages.

- **Fields:**
  - `senderId` (ObjectId, required): User sending the message.
  - `receiverId` (ObjectId, required): User receiving the message.
  - `text` (String): Message content.
  - `image` (String): Optional image URL.
  - **Timestamps:** Tracks when the message was sent.

---

### 4. TripMemory Model ([src/models/TripMemory.model.js](src/models/TripMemory.model.js))

Stores user memories (e.g., trips).

- **Fields:**
  - `tripName` (String): Name of the trip.
  - `ownerName` (String): Name of the memory owner.
  - `date` (Date): Date of the memory.
  - `link` (String): Optional link (e.g., to photos).
  - `image` (String): Image URL.

---

## Routes & Controllers

### Auth Routes ([src/routes/auth.route.js](src/routes/auth.route.js)), Controller ([src/controllers/auth.controller.js](src/controllers/auth.controller.js))

- `/api/auth/signup`: Registers a new user.
- `/api/auth/login`: Authenticates user, returns JWT cookie.
- `/api/auth/logout`: Logs out user (clears JWT).
- `/api/auth/onboarding`: Completes user profile (requires JWT).
- `/api/auth/me`: Returns current user info (requires JWT).

**Controller Logic:**  
Handles validation, user creation, password hashing, JWT generation, onboarding updates, and logout.

---

### User Routes ([src/routes/user.route.js](src/routes/user.route.js)), Controller ([src/controllers/user.controller.js](src/controllers/user.controller.js))

- `/api/users`: Get recommended users.
- `/api/users/friends`: Get user's friends.
- `/api/users/memories-form`: Add a new memory.
- `/api/users/friend-request/:id`: Send friend request.
- `/api/users/friend-request/:id/accept`: Accept friend request.
- `/api/users/friend-requests`: Get incoming requests.
- `/api/users/outgoing-friend-requests`: Get outgoing requests.

**Controller Logic:**  
Handles friend request creation/acceptance, fetching requests/friends, and storing memories.

---

### Chat Routes ([src/routes/chat.route.js](src/routes/chat.route.js)), Controller ([src/controllers/chat.controller.js](src/controllers/chat.controller.js))

- `/api/chat/:id`: Get messages with a user.
- `/api/chat/send-message`: Send a new message.

**Controller Logic:**  
Handles message retrieval and sending, integrates with Stream for chat/video tokens.

---

## Middleware

### Auth Middleware ([src/middleware/auth.middleware.js](src/middleware/auth.middleware.js))

- **protectRoute:**  
  Checks for JWT in cookies, verifies it, and attaches the user to `req.user`.  
  Returns 401 if not authenticated.

---

## Lib Folder

Contains utility modules:

- **db.js:**  
  Connects to MongoDB using Mongoose. Uses URI from `.env`.

- **cloudinary.js:**  
  Configures Cloudinary for image uploads. Uses credentials from `.env`.

- **stream.js:**  
  Integrates with Stream API for chat/video features. Uses API keys from `.env`.

---

## Environment Variables

Set in `.env`:

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET_KEY`: JWT signing secret.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials.
- `STREAM_API_KEY`, `STREAM_API_SECRET`: Stream credentials.
- `PORT`: Server port.

---

## Error Handling

- All controllers catch errors and return appropriate HTTP status and messages.
- Auth middleware returns 401 for unauthorized access.

---

## Deployment

- Vercel config in `vercel.json` for serverless deployment.
- Static files served from `/public`.

---

## How It Works

1. **User signs up or logs in**: JWT cookie is set.
2. **Protected routes**: Require JWT, checked by middleware.
3. **User can send/accept friend requests, chat, and create memories**.
4. **Media uploads**: Handled via Cloudinary.
5. **Chat/video**: Integrated with Stream API.

---

## Extending

- Add more endpoints in `routes` and `controllers`.
- Add more fields to models as needed.
- Integrate more third-party services in `lib`.

---

## References

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)
- [Stream](https://getstream.io/)
