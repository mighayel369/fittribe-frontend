import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bgpic from "../../assets/reset-password.webp";
import LogoHeader from "../../assets/logo.jpg";
import PasswordInput from "../../components/PasswordInput";
import SubmitButton from "../../components/SubmitButton";
import BackgroundImageWrapper from "../../components/BackgroundImage";
import { UserAuthService } from "../../services/user/user.auth";


const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "FitTribe | Secure Reset";
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      if (!token) {
        setError("Invalid or expired reset session.");
        return;
      }

      const response = await UserAuthService.resetPassword(token, password);

      if (response.success) {
        const role = response.role;
        navigate(role === "trainer" ? "/trainer/login" : "/login", {
          state: { message: response.message || "Password updated successfully! Please log in." }
        });
      } 
    } catch (err: any) {
      const message = err.response?.data?.message
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={bgpic}>
      <div className="flex items-center justify-center w-screen h-screen p-4">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-[440px] border border-white/40 overflow-hidden">

          <header className="text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img
                src={LogoHeader}
                alt="FitTribe Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Secure <span className="text-blue-600">Update</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Protect your progress with a new password.</p>
          </header>
          {error && (
            <div className="mb-6 flex items-center bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-shake">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-wider">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-4">
              <PasswordInput
                label="New Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showButton={true}


              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                showButton={true}

              />
            </div>
            <div className="pt-2">
              <SubmitButton
                text="Update Password"
                loading={loading}

              />
            </div>
          </form>
          <footer className="mt-8 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Secure End-to-End Encryption
            </p>
          </footer>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default ResetPassword;
