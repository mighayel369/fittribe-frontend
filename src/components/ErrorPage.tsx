import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { getErrorConfig } from '../constants/errorContent';


const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusParam = searchParams.get('status');
  const serverMessage = searchParams.get('msg') || undefined;

  const statusCode = statusParam ? parseInt(statusParam, 10) : 404;

  const { title, message, badgeText, badgeColor, IconComponent } = getErrorConfig(statusCode, serverMessage);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6 flex justify-center animate-bounce">
          <IconComponent size={75} className="text-gray-700" />
        </div>

        <h1 className="text-9xl font-extrabold text-gray-200 tracking-widest relative select-none">
          {statusCode}
        </h1>

        <div className={`${badgeColor} text-white px-3 py-1 text-xs font-semibold rounded rotate-12 absolute transform -translate-y-24 translate-x-32 hidden sm:inline-block shadow-md`}>
          {badgeText}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;