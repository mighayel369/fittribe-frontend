import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import backgroundImage from '../../assets/forgot-password.webp';
import LogoHeader from '../../assets/logo.jpg';

import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";
import BackgroundImageWrapper from '../../components/BackgroundImage';
import { FaArrowLeft, FaEnvelopeOpenText } from 'react-icons/fa';
import { UserAuthService } from '../../services/user/user.auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "FitTribe | Reset Password";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    if (!email) {
      setError("Please provide your email address.");
      return;
    }

    setLoading(true);
    try {
      const data = await UserAuthService.forgotPassword(email);
      if (data.success) {
        setMsg(data.message||'Check your inbox! A reset link is on its way.');
      }
    } catch(err:any) {
       const message = err.response?.data?.message
      setError(message||"System error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={backgroundImage}>
      <div className="flex justify-center w-full h-screen items-center p-4">
        
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-[440px] border border-white/40 overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <div className={`h-full bg-blue-600 transition-all duration-700 ${msg ? 'w-full' : 'w-1/3'}`}></div>
          </div>

          <header className="mb-8 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img 
                src={LogoHeader} 
                alt="FitTribe Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Recovery <span className="text-blue-600">Center</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Don't lose your momentum.</p>
          </header>
          {msg ? (
            <div className="text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelopeOpenText size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Check your Email</h3>
              <p className="text-sm text-gray-600 mb-6">{msg}</p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all"
              >
                <FaArrowLeft /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn" noValidate>
              
              <div className="space-y-4">
                <TextInput
                  name='email'
                  label="Registered Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  error={error}
    
                />
              </div>

              <div className="space-y-4">
                <SubmitButton loading={loading} text="Request Reset Link" />
                
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-[0.2em]"
                  >
                    <FaArrowLeft /> Nevermind, I remembered!
                  </Link>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default ForgotPassword;
