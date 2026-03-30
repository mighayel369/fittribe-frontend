import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../redux/hooks";
import { setAuth } from '../../redux/slices/authSlice';

const GoogleAuthSuccess: React.FC = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "error">("loading")
  const dispatch = useAppDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token");
    if (token) {
     dispatch(setAuth({ 
     accessToken: token, 
            role: 'user'
          }));
      setTimeout(() => navigate("/"), 1000)
    } else {
      setStatus("error");
    }
  }, [navigate])
  if (status === "error") {
    return (
      <>
       
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-md p-6 text-center max-w-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Failed</h2>
          <p className="text-gray-700 mb-4">
            Something went wrong while logging in with Google. Please try again.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
      </>
    );
  }
  return (
    <>

    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-6 animate-spin"></div>
      <p className="text-gray-700 text-lg font-medium">Logging you in securely...</p>
    </div>
    </>
  )
}

export default GoogleAuthSuccess