
import React, { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import loginpic from '../../assets/loginpic.webp';
import {setAuth} from '../../redux/slices/authSlice';
import LogoHeader from '../../assets/logo.jpg'
import Toast from "../../components/Toast";
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import SubmitButton from '../../components/SubmitButton';
import GoogleAuthButton from '../../components/GoogleAuthButton';
import BackgroundImageWrapper from '../../components/BackgroundImage';
import { UserAuthService } from '../../services/user/user.auth';
import {type ValidationErrors } from '../../validations/ValidationErrors';
import type { UserLoginDTO } from '../../types/userType';
import { userLoginValidation } from '../../validations/userLoginValidation';


const UserLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors<UserLoginDTO>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    document.title = "FitTribe | Login";

    if (location.state?.message) {
      setToastMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const validationErrors = userLoginValidation({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const result = await UserAuthService.login({email, password});

      if (result.success) {
       dispatch(setAuth({ 
      accessToken: result.accessToken, 
      role: result.role,
      user: result.user
    }));
        navigate(-1)
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={loginpic}>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      <div className="flex justify-center md:justify-start w-full h-screen items-center p-4 md:pl-24">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-[440px] border border-white/40">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-black rounded-b-full opacity-10"></div>

          <header className="mb-10 text-center flex flex-col items-center">
            <div className="mb-4 w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
              <img
                src={LogoHeader}
                alt="FitTribe Logo"
                className="w-full h-fll object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>

            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
              FIT<span className="text-blue-600">TRIBE</span>
            </h1>

            <div className="mt-2 flex flex-col items-center">
              <p className="text-gray-500 font-medium">Elevate your fitness journey</p>
              <div className="w-8 h-1 bg-blue-600 rounded-full mt-1 opacity-20"></div>
            </div>
          </header>

          {generalError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm flex items-center shadow-sm">
              <p><span className="font-bold">Access Denied:</span> {generalError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <TextInput
                label='Email'
                name='email'
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <div className="space-y-2">
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                showButton={true} 
              />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs font-bold text-gray-500 hover:text-black transition-all hover:tracking-wide"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>
              </div>
            </div>

            <SubmitButton loading={loading} text="Login" />
          </form>

          <div className="mt-8 mb-8 flex items-center justify-between gap-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Social Connect</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <GoogleAuthButton text="Continue with Google" onClick={() => UserAuthService.initiateGoogleLogin()} />

          <footer className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-black hover:underline underline-offset-4 decoration-blue-600">
              JOIN NOW
            </Link>
          </footer>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default UserLogin;