import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import { useAuthStore } from "./store/useAuthStore.js";
import FriendsPage from "./pages/FriendsPage.jsx";
import MemoriesPage from "./pages/MemoriesPage.jsx";
import VideoCallPage from "./pages/VideoCallPage.jsx";
import { useEffect } from "react";

const App = () => {
  const { theme } = useThemeStore();
  const {
    isAuthenticated,
    isOnboarded,
    isLoading,
    isCheckingAuth,
    authUser,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  if (isLoading || isCheckingAuth) {
    return <PageLoader />;
  }

  console.log(
    "authUser is",
    authUser,
    "isAuthenticated",
    isAuthenticated,
    "isOnboarded",
    isOnboarded,
    "isLoading",
    isLoading,
    "isCheckingAuth",
    isCheckingAuth
  );

  if (isLoading || isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/memories"
          element={
            isLoading || isCheckingAuth ? (
              <PageLoader />
            ) : isAuthenticated && isOnboarded ? (
              <Layout>
                <MemoriesPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/video-calls"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <VideoCallPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        {/* <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        /> */}

        <Route
          path="/message/:id"
          element={
            isLoading || isCheckingAuth ? (
              <PageLoader />
            ) : isAuthenticated && isOnboarded ? (
              <Layout>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
