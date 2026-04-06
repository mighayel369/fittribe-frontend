import { Routes, Route } from 'react-router-dom';
import TrainerLogin from '../pages/trainer/TrainerLogin';
import TrainerSignup from '../pages/trainer/TrainerSignup';
import TrainerHome from '../pages/trainer/TrainerHome';
import TrainerPublicRoute from '../components/TrainerPublicRoute';
import TrainerPrivateRoute from '../components/TrainerPrivateRoute';
import TrainerProfile from '../pages/trainer/TrainerProfile';
import ReapplyPage from '../pages/trainer/ReapplyPage';
import TrainerEditProfile from '../pages/trainer/TrainerEditProfile';
import TrainerAvailability from '../pages/trainer/TrainerAvailability';
import TrainerBookings from '../pages/trainer/TrainerBookings';
import BookingDetails from '../pages/trainer/BookingDetails';
import TrainerLeaveManagement from '../pages/trainer/TrainerLeaveManagment';
import ChatPage from '../pages/trainer/ChatPage';
const TrainerRoutes = () => (
  <Routes>
    <Route path="login" element={<TrainerPublicRoute><TrainerLogin /></TrainerPublicRoute>} />
    <Route path="signup" element={<TrainerPublicRoute><TrainerSignup /></TrainerPublicRoute>} />
    <Route path="" element={<TrainerPrivateRoute><TrainerHome /></TrainerPrivateRoute>} />
    <Route path="/trainer-profile" element={<TrainerPrivateRoute><TrainerProfile /></TrainerPrivateRoute>} />
    <Route path="/trainer-profile/re-apply" element={<TrainerPrivateRoute><ReapplyPage /></TrainerPrivateRoute>} />
    <Route path="/trainer-profile/edit-profile" element={<TrainerPrivateRoute><TrainerEditProfile /></TrainerPrivateRoute>} />
    <Route path="/availability" element={<TrainerPrivateRoute><TrainerAvailability /></TrainerPrivateRoute>} />
    <Route path="/leaves" element={<TrainerPrivateRoute><TrainerLeaveManagement /></TrainerPrivateRoute>} />
    <Route path="/bookings" element={<TrainerPrivateRoute><TrainerBookings /></TrainerPrivateRoute>} />
    <Route path="/bookings/:id" element={<TrainerPrivateRoute><BookingDetails /></TrainerPrivateRoute>} />
        <Route path="/chats" element={<TrainerPrivateRoute><ChatPage /></TrainerPrivateRoute>} />
  </Routes>
);


export default TrainerRoutes;
