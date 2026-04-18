import React from 'react'
import { useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
interface ToastProps{
    message:String;
    type?:"success"|"error";
    onClose:()=>void;
}

const Toast:React.FC<ToastProps>=({message, type = "success", onClose})=>{
    useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000);
    return () => clearTimeout(timer)
  }, [onClose])
   const isSuccess = type === "success";
    return (
    <div
      className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
      ${isSuccess ? "bg-emerald-600" : "bg-red-600"} text-white`}
    >
      {isSuccess ? (
        <FaCheckCircle size={20} />
      ) : (
        <FaTimesCircle size={20} />
      )}
      <span className="text-sm font-medium">{message}</span>

      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast