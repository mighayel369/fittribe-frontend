
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setEmailNull, setRoleNull } from '../../redux/slices/otpSlice';

import otppic from '../../assets/otppage.webp';
import LogoHeader from '../../assets/logo.jpg';
import SubmitButton from '../../components/SubmitButton';
import BackgroundImageWrapper from '../../components/BackgroundImage';
import OTPInputGroup from '../../components/OTPInputGroup';
import { AuthService } from '../../services/shared/auth.service';


const AuthVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const email = useAppSelector((state) => state.otp.Useremail);
  const role = useAppSelector((state) => state.otp.role);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FitTribe | Security Verification";
    if (!email) navigate('/login');
  }, [email, navigate]);

  useEffect(() => {
    const startTime = localStorage.getItem('startTime');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      setTimer(Math.max(60 - elapsed, 0));
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('startTime');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; 
    const updated = [...otp];
    updated[index] = value.substring(value.length - 1);
    setOtp(updated);
    
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!role) return;
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

    const result = await AuthService.verifyOtp(email!, otpCode,role);
      
      if (result.success) {
        localStorage.removeItem('startTime');
        dispatch(setEmailNull());
        const targetRole = role;
        dispatch(setRoleNull());

        navigate(targetRole === 'trainer' ? '/trainer/login' : '/login', { 
          state: { message: "Account verified successfully! Please log in."} 
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || !role) return;
    try {
      await AuthService.resendOtp(email, role);
      setOtp(new Array(6).fill(''));
      inputRef.current[0]?.focus();
      localStorage.setItem('startTime', Date.now().toString());
      setTimer(60);
      setError('');
    } catch (err) {
      setError("Failed to resend code. Try again later.");
    }
  };

  return (
    <BackgroundImageWrapper image={otppic}>
      <div className="flex items-center justify-center w-full h-screen px-4">
        <div className="relative bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[460px] p-8 md:p-12 text-center border border-white/40 overflow-hidden">

          <header className="mb-8 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img src={LogoHeader} alt="FitTribe Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Verify <span className="text-blue-600">Identity</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Secure code sent to <span className="text-black font-bold">{email}</span>
            </p>
          </header>

          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-6">
             <OTPInputGroup otp={otp} onChange={handleOtpChange} inputRef={inputRef} />
             {error && (
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-4 animate-shake">
                 {error}
               </p>
             )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${timer > 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-4xl font-mono font-bold text-gray-900 tracking-widest">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Resend otp code
            </p>
            
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`mt-2 text-xs font-black uppercase tracking-widest transition-all ${
                timer > 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-blue-600 hover:text-black underline underline-offset-4 decoration-2'
              }`}
            >
              Resend Code
            </button>
          </div>

          <SubmitButton 
            text="Confirm & Continue" 
            loading={isLoading} 
            onClick={handleSubmit} 
            type="button" 
          />
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default AuthVerification;