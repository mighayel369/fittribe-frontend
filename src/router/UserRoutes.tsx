import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import UserLogin from "../pages/user/UserLogin";
import UserSignup from "../pages/user/UserSignup";
import AuthVerification from "../pages/user/AuthVerification";
import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";
import GoogleAuthSuccess from "../pages/user/GoogleAuthSuccess";
import PublicRoute from "../components/PublicRoute";
import PrivateRouteOtp from "../components/PrivateRouteOtp";
import UserProfile from "../pages/user/UserProfile";
import EditProfile from "../pages/user/EditProfile";
import TrainerListing from "../pages/user/TrainerListing";
import TrainerProfile from "../pages/user/TrainerProfile";
import PrivateRoute from "../components/PrivateRoute";
import TrainerBookingPage from "../pages/user/TrainerBookingPage";
import Bookings from "../pages/user/Bookings";
import BookingDetails from "../pages/user/BookingDetails";
import ChatPage from "../pages/user/ChatPage";
import VideoSession from "../pages/shared/VideoSession";
export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

      <Route path="trainers" element={<TrainerListing />} />
      <Route path="trainer-details/:id" element={<TrainerProfile />} />

      <Route path="login" element={<PublicRoute><UserLogin /></PublicRoute>} />
      <Route path="signup" element={<PublicRoute><UserSignup /></PublicRoute>} />

      <Route path="otp" element={<PrivateRouteOtp><AuthVerification /></PrivateRouteOtp>} />

      <Route path="oauth-success" element={<GoogleAuthSuccess />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="trainer-booking/:trainerId" element={<PrivateRoute><TrainerBookingPage /></PrivateRoute>} />
      <Route path="bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
      <Route path="bookings/:bookingId" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
      <Route path="chat/:trainerId/:chatId?" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/session/:bookingId" element={<PrivateRoute><VideoSession /></PrivateRoute>} />
    </Routes>
  );
}
