# Gopuram Frontend Documentation

This is the frontend for the Gopuram app, built with **React** and **Vite**. It communicates with the backend via REST APIs and uses **Socket.io** for real-time chat. The project is modular, scalable, and uses modern React best practices.

---

## Folder Structure

- **src/**
  - **pages/**: Main page components (e.g., `ChatPage.jsx`, `HomePage.jsx`)
  - **components/**: Reusable UI components (e.g., `ChatHeader`, `ChatInput`, `ChatBodyComponent`)
  - **lib/**: API utilities and helpers (`api.js`)
  - **store/**: State management (e.g., `useSocketStore.js`, `useAuthStore.js`)
  - **assets/**: Static images and icons
  - **App.jsx**: Main app component
  - **main.jsx**: Entry point

---

## Main Libraries Used

- **React**: UI library
- **Vite**: Fast development/build tool
- **@tanstack/react-query**: Data fetching and caching
- **Socket.io-client**: Real-time communication
- **Axios**: HTTP requests
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **React Router**: Routing

---

## API Integration

All API calls are defined in `src/lib/api.js`.  
The frontend communicates with the backend at:

```
http://localhost:3000/api/
```

### Example API Endpoints Used

- **Auth**

  - `POST /api/auth/signup` — Register user
  - `POST /api/auth/login` — Login user
  - `GET /api/auth/me` — Get current user info

- **User**

  - `GET /api/users/get-users` — Get recommended users
  - `GET /api/users/get-user/:id` — Get user by ID
  - `GET /api/users/friends` — Get friends list
  - `POST /api/users/friend-request/:id` — Send friend request
  - `PUT /api/users/friend-request/:id/accept` — Accept friend request
  - `POST /api/users/memories-form` — Add a memory

- **Chat**
  - `GET /api/chat/:id` — Get chat messages
  - `POST /api/chat/send-message` — Send a message (text/image)

---

## Real-Time Chat (Socket.io)

- **Socket connection** is established in `useSocketStore.js`:
  ```js
  import { io } from "socket.io-client";
  export const socket = io("http://localhost:3000", { withCredentials: true });
  ```
- **Events:**
  - `register-user`: Registers the user on the socket server
  - `send-message`: Emits when a message is sent
  - `recieved-message`: Listens for new messages from other users
  - `welcome`: Receives welcome message from server

---

## State Management

- **Zustand** is used for global state (auth, socket, etc.)
- **React Query** manages server state, caching, and background updates

---

## Styling

- **Tailwind CSS** is used for utility-first styling
- Custom components for chat, forms, loaders, etc.

---

## Routing

- **React Router** is used for navigation between pages:
  - `/` — Home
  - `/chat/:id` — Chat page
  - `/profile/:id` — User profile
  - `/memories` — Memories page

---

## How to Run

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. The app runs at [http://localhost:5173](http://localhost:5173)

---

## Production

For production builds:

```
npm run build
```

Deploy the `dist/` folder to your preferred hosting (e.g., Railway, Vercel, Netlify).

---

## Environment Variables

- **VITE_API_URL**: Backend API base URL (set in `.env`)
- **Other VITE\_\*** variables as needed for third-party integrations

---

## References

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Socket.io](https://socket.io/)
- [Axios](https://axios-http.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
