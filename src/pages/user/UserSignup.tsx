
import React, { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { setEmail, setRole } from '../../redux/slices/otpSlice';
import signuppic from '../../assets/signuppic.webp';
import LogoHeader from '../../assets/logo.jpg';


import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import SubmitButton from '../../components/SubmitButton';
import GoogleAuthButton from '../../components/GoogleAuthButton';
import BackgroundImageWrapper from '../../components/BackgroundImage';
import { UserAuthService } from '../../services/user/user.auth';
import type { ValidationErrors } from '../../validations/ValidationErrors';
import type { UserSignupDTO } from '../../types/userType';
import { userSignupValidation } from '../../validations/userSignupValidation';


const UserSignup: React.FC = () => {
  const [email, setEmailVal] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<ValidationErrors<UserSignupDTO>>({});
  const [loading, setLoading] = useState(false);
  const [genericErrors, setGenericErrors] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FitTribe | Join the Movement";
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenericErrors('');
    setErrors({});

    const validationData: UserSignupDTO = { name, email, password, confirm };
    const validationErrors = userSignupValidation(validationData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await UserAuthService.register({name, email, password});

      if (response.success) {
        dispatch(setEmail(email));
        dispatch(setRole('user'));

        localStorage.setItem('startTime', Date.now().toString());
        navigate('/otp');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setGenericErrors(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={signuppic}>
      <div className="flex justify-center md:justify-end w-full h-screen items-center p-4 md:pr-24">
        <div className="relative bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[450px] border border-white/40 overflow-hidden">
          

          <header className="mb-8 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img 
                src={LogoHeader} 
                alt="FitTribe Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
              CREATE <span className="text-blue-600">ACCOUNT</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Start your transformation today</p>
          </header>

          {genericErrors && (
            <div className="mb-6 flex items-center bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg shadow-sm animate-fadeIn">
              <svg className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-xs font-bold text-red-700 uppercase tracking-wide">
                {genericErrors}
              </p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <TextInput
            name='name'
             label='Full Name'
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
           
            />
            
            <TextInput
            name='email'
            label='Email'
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmailVal(e.target.value)}
              error={errors.email}
              
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                showButton={true} 
              />
              <PasswordInput
                label="Confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                error={errors.confirm}
                showButton={true} 
              />
            </div>

            <SubmitButton loading={loading} text="Create Account" />
          </form>

          <div className="mt-6 mb-6 flex items-center justify-between gap-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Quick Signup</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <GoogleAuthButton text="Sign up with Google" onClick={() => UserAuthService.initiateGoogleLogin()} />

          <footer className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-black hover:underline underline-offset-4 decoration-blue-600">
              LOG IN
            </Link>
          </footer>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default UserSignup;