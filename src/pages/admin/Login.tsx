
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import {type AdminLoginDTO } from '../../types/adminType';
import { setAuth} from '../../redux/slices/authSlice';
import { AdminAuthService } from '../../services/admin/admin.auth';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import SubmitButton from '../../components/SubmitButton';
import BackgroundImageWrapper from '../../components/BackgroundImage';
import { FaShieldAlt } from 'react-icons/fa';
import adminLoginPic from '../../assets/admin-loginPic.webp';
import LogoHeader from '../../assets/logo.jpg';
import type { ValidationErrors } from '../../validations/ValidationErrors';
import { adminLoginValidation } from '../../validations/adminLoginValidation';


const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors<AdminLoginDTO>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "FitTribe | Admin Console";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    
    const newErrors = adminLoginValidation({ email, password });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await AdminAuthService.login({email, password});
if (response.success) {
    dispatch(setAuth({ 
      accessToken: response.accessToken, 
      role: response.role,
      user:response.admin
    }));
    
    navigate('/admin', { state: { message: response.message } });
  }
    } catch (error: any) {
      const message = error.response?.data?.message || "Unauthorized access attempt.";
      setGeneralError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={adminLoginPic}>

      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-0"></div>

      <div className="flex justify-center w-full h-screen items-center p-4 z-10 relative">
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 md:p-12 w-full max-w-[460px] border border-white/20">
       
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900 rounded-b-full opacity-30"></div>

          <header className="mb-10 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white group">
              <img 
                src={LogoHeader} 
                alt="FitTribe Logo" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" 
              />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              ADMIN <span className="text-slate-500 font-light">CONSOLE</span>
            </h1>
            <p className="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">Secure Access Only</p>
          </header>
          {generalError && (
            <div className="mb-6 flex items-center bg-slate-900 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-lg animate-shake">
              <FaShieldAlt className="text-amber-500 mr-3 flex-shrink-0" />
              <p className="text-[10px] font-black text-white uppercase tracking-wider">
                {generalError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <TextInput
              name='email'
              label="Administrative Email"
              type="email"
              placeholder="admin@fittribe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
      
            />

            <PasswordInput
              label="Master Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              showButton={true}
          
            />

            <div className="pt-4">
              <SubmitButton 
                text="Verify & Authorize" 
                loading={loading} 
              />
            </div>
          </form>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default AdminLogin;