import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  MessageSquare, 
  Wallet, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  Layers
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      label: "Trainer Management",
      isParent: true,
      icon: <UserSquare2 size={18} />,
      isOpen: isTrainerOpen,
      toggle: () => setIsTrainerOpen(!isTrainerOpen),
      children: [
        { label: "All Trainers", to: "/admin/trainers" },
        { label: "Leave Requests", to: "/admin/trainer-leaves" },
      ]
    },
    { label: "User Directory", to: "/admin/users", icon: <Users size={18} /> },
    { label: "Programs", to: "/admin/programs", icon: <Layers size={18} /> },
    { label: "Messages", to: "/admin/chats", icon: <MessageSquare size={18} /> },
    { label: "Wallet & Revenue", to: "/admin/wallet", icon: <Wallet size={18} /> },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gray-900 text-gray-300 fixed top-16 left-0 flex flex-col justify-between border-r border-gray-800 shadow-xl z-40">
      <div className="p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-3">
          Main Menu
        </p>

        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;

          if (item.isParent) {
            return (
              <div key={index} className="flex flex-col">
                <button
                  onClick={item.toggle}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-800 hover:text-white ${
                    item.children?.some(child => location.pathname === child.to) ? "text-yellow-500 bg-gray-800/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                  {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${item.isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pl-10 mt-1 flex flex-col gap-1 border-l-2 border-gray-800 ml-5">
                    {item.children?.map((child, cIdx) => (
                      <Link
                        key={cIdx}
                        to={child.to}
                        className={`py-2 text-xs font-semibold hover:text-yellow-400 transition-colors ${
                          location.pathname === child.to ? "text-yellow-500" : "text-gray-500"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={index}
              to={item.to as string}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" 
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-black" : "text-gray-400 group-hover:text-yellow-500"}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;