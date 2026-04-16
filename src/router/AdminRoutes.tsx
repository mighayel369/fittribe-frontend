import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import AdminLogin from '../pages/admin/Login';
import UserList from '../pages/admin/UserList';
import UserDetails from '../pages/admin/UserDetails';
import TrainerList from '../pages/admin/TrainerList';
import TrainerDetails from '../pages/admin/TrainerDetails';
import VerifyTrainer from '../pages/admin/VerifyTrainer';
import AdminPublicRoute from '../components/AdminPublicRoute';
import AdminPrivateRoute from '../components/AdminPrivateRoute';
import ProgramsList from '../pages/admin/ProgramsList';
import ModifyProgram from '../pages/admin/ModifyProgram';
import AdminWallet from '../pages/admin/AdminWallet'
import OnboardNewProgram from '../pages/admin/OnboardNewProgram';
import LeaveManagemnt from '../pages/admin/LeaveManagement';
import AdminReviewsPage from '../pages/admin/ReviewPage';
import NotFoundPage from '../components/NotFound';
import BookingList from '../pages/admin/BookingList';
import BookingDetails from '../pages/admin/BookingDetails';
const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
    <Route path="" element={<AdminPrivateRoute><Dashboard /></AdminPrivateRoute>} />
    <Route path="users" element={<AdminPrivateRoute><UserList /></AdminPrivateRoute>} />
    <Route path="users/:id" element={<AdminPrivateRoute><UserDetails /></AdminPrivateRoute>} />
    <Route path="trainers" element={<AdminPrivateRoute><TrainerList /></AdminPrivateRoute>} />
    <Route path="trainers/:id" element={<AdminPrivateRoute><TrainerDetails /></AdminPrivateRoute>} />
    <Route path="verify-trainer" element={<AdminPrivateRoute><VerifyTrainer /></AdminPrivateRoute>} />
    <Route path="programs" element={<AdminPrivateRoute><ProgramsList /></AdminPrivateRoute>} />
    <Route path="programs/onboard-new" element={<AdminPrivateRoute><OnboardNewProgram /></AdminPrivateRoute>} />
    <Route path="programs/modify/:id" element={<AdminPrivateRoute><ModifyProgram /></AdminPrivateRoute>} />
    <Route path="wallet" element={<AdminPrivateRoute><AdminWallet /></AdminPrivateRoute>} />
    <Route path="trainer-leaves" element={<AdminPrivateRoute><LeaveManagemnt /></AdminPrivateRoute>} />
    <Route path="reviews" element={<AdminPrivateRoute><AdminReviewsPage /></AdminPrivateRoute>} />
    <Route path="bookings" element={<AdminPrivateRoute><BookingList /></AdminPrivateRoute>} />
    <Route path="bookings/:id" element={<AdminPrivateRoute><BookingDetails /></AdminPrivateRoute>} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AdminRoutes;
