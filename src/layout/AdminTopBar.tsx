import logoPic from '../assets/logo.jpg'
import { IoIosNotifications } from "react-icons/io"
import { ChevronDown, LogOut, Settings, User } from "lucide-react" 
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { AuthService } from '../services/shared/auth.service'
import { clearAuth } from "../redux/slices/authSlice";

const AdminTopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  
  const { role, user } = useAppSelector((state: any) => state.auth);

  const handleLogout = async () => {
    await AuthService.logout(role)
    dispatch(clearAuth());
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white w-full h-16 px-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-2xl">
      
      <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/admin')}>
        <div className="relative">
          <img src={logoPic} alt="logo" className="w-9 h-9 object-cover rounded-xl ring-2 ring-red-500/20 group-hover:ring-red-500 transition-all" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white">FitTribe</h1>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none">Admin Control</p>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <IoIosNotifications size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-gray-900"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all ${showDropdown ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-orange-400 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-white leading-none">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-1">{role}</p>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-[60] overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-gray-800 mb-2">
                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                <p className="text-sm font-bold truncate">{user?.email || 'admin@fittribe.com'}</p>
              </div>

              <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <User size={16} /> Profile Settings
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                <Settings size={16} /> System Logs
              </button>
              
              <div className="h-px bg-gray-800 my-2 mx-4"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-bold"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default AdminTopBar;