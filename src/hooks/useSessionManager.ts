
import { useDispatch } from 'react-redux';
import { clearAuth } from '../redux/slices/authSlice';
import { UserProfileService } from '../services/user/user.profile';
import toast from 'react-hot-toast';

export const useSessionManager = () => {
  const dispatch = useDispatch();

  const verify = async () => {
    try {
      await UserProfileService.verifySession();
    } catch (error: any) {
      if (error.response?.status === 403) {
        dispatch(clearAuth());
        toast.error("Your account has been blocked. Please contact support.");
      }
    }
  };

  return { verify };
};