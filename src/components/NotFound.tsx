import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">
          404
        </h1>
        
        <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute transform -translate-y-16 translate-x-32 hidden sm:block">
          Page Not Found
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
          Lost in the Tribe?
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Don't let it break your workout streak!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;