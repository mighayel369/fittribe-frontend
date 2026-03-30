
import React, { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import loginpic from '../../assets/trainer-loginpic.webp';
import LogoHeader from '../../assets/logo.jpg';
import { setAuth } from '../../redux/slices/authSlice';
import { TrainerAuthService } from '../../services/trainer/trainer.auth';
import Toast from "../../components/Toast";
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import SubmitButton from '../../components/SubmitButton';
import BackgroundImageWrapper from '../../components/BackgroundImage';
import {type TrainerLoginDTO } from '../../types/trainerType';
import type { ValidationErrors } from '../../validations/ValidationErrors';
import { trainerLoginValidate } from '../../validations/trainerLoginValidate';

const TrainerLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors<TrainerLoginDTO>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "FitTribe | Trainer Portal";
    if (location.state?.message) {
      setToastMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrors({});
  setGeneralError('');
  
  const newErrors = trainerLoginValidate({ email, password });
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    const result = await TrainerAuthService.login({ email, password });

    if (result.success) {

     dispatch(setAuth({ 
      accessToken: result.accessToken, 
      role: result.role ,
      user:result.trainer
    }));
      navigate('/trainer',{
        state:{
          message:result.message
        }
      }); 
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Invalid trainer credentials.";
    setGeneralError(errorMsg);
  } finally {
    setLoading(false);
  }
};
  return (
    <BackgroundImageWrapper image={loginpic}>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50">
          <Toast 
            message={toastMessage} 
            type="success" 
            onClose={() => setToastMessage(null)} 
          />
        </div>
      )}

      <div className="flex justify-center md:justify-start w-full h-screen items-center p-4 md:pl-24">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-[440px] border border-white/40">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-red-600 rounded-b-full opacity-20"></div>

          <header className="mb-10 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img 
                src={LogoHeader} 
                alt="FitTribe Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              TRAINER <span className="text-red-600">LOGIN</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Access your professional dashboard</p>
          </header>

          {generalError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-xs font-bold uppercase tracking-tight flex items-center shadow-sm">
              {generalError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <TextInput
              name='email'
              label="Professional Email"
              type="email"
              placeholder="trainer@fittribe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}

            />

            <div className="space-y-2">
              <PasswordInput
                label="Secure Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showButton={true}
                error={errors.password}
            
              />
            </div>

            <SubmitButton loading={loading} text="Sign In to Portal" />
          </form>
          <footer className="mt-10 text-center text-sm text-gray-500">
            Don't have a professional account?{' '}
            <Link to="/trainer/signup" className="text-black font-black hover:underline underline-offset-4 decoration-red-600 uppercase text-xs">
              Apply Now
            </Link>
          </footer>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default TrainerLogin;