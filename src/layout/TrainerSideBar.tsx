import { Link, useLocation, useNavigate } from "react-router-dom";
import logoPic from '../assets/logo.jpg';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrainerProfileService } from "../services/trainer/trainer.profile";
import { clearAuth } from "../redux/slices/authSlice";
import { FaLock, FaChevronDown, FaChevronRight } from "react-icons/fa";

const TrainerSideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.accessToken);

  const [trainerStatus, setTrainerStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/trainer" },
    {
      label: "Management",
      isParent: true,
      isOpen: isScheduleOpen,
      toggle: () => setIsScheduleOpen(!isScheduleOpen),
      children: [
        { label: "Schedules", to: "/trainer/availability" },
        { label: "Leaves", to: "/trainer/leaves" },
      ]
    },
    { label: "Bookings", to: "/trainer/bookings" },
    { label: "Chats", to: "/trainer/chats" },
    { label: "Reviews", to: "/trainer/reviews" },
    { label: "Profile", to: "/trainer/trainer-profile" },
  ];

  useEffect(() => {
    if (location.pathname.includes("/availability") || location.pathname.includes("/leaves")) {
      setIsScheduleOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const verifyTrainer = async () => {
      if (!token) {
        navigate('/trainer/login');
        return;
      }
      try {
        const res = await TrainerProfileService.verifySession();

        if (!res.success || res.trainer.status === false) {
          dispatch(clearAuth());
          navigate('/trainer/login');
          return;
        }

        const status = res.trainer.verified;
        setTrainerStatus(status);

        const isRestricted = status === "pending" || status === "rejected";
        if (isRestricted && location.pathname !== "/trainer/trainer-profile") {
          navigate("/trainer/trainer-profile", { replace: true });
        }

      } catch (error: any) {
        let errMesg = error.response?.data?.message;
        dispatch(clearAuth());
        navigate('/trainer/login', {
          state: { message: errMesg }
        });
      } finally {
        setLoading(false);
      }
    };

    verifyTrainer();
  }, [token, dispatch]);

  const isRestricted = trainerStatus === "pending" || trainerStatus === "rejected";

  if (loading) return null;

  return (
    <aside className="w-64 fixed top-4 left-4 bg-white border border-gray-300 text-gray-800 py-6 px-5 shadow-xl z-30 rounded-lg h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex flex-col items-center gap-2 mb-8">
        <img src={logoPic} alt="logo" className="w-14 h-14 object-cover rounded-full shadow-md" />
        <h1 className="text-2xl font-bold tracking-wide">FitTribe</h1>
        <p className="text-sm text-gray-500 font-medium">Trainer Portal</p>
      </div>

      {isRestricted && (
        <div className={`mb-6 p-2 rounded-md text-[10px] font-bold uppercase text-center border ${
          trainerStatus === 'pending' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {trainerStatus} Access Restricted
        </div>
      )}

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const disabled = isRestricted && item.label !== "Profile";

          if (disabled) {
            return (
              <span
                key={item.label}
                className="px-4 py-2 rounded-md text-base font-medium text-gray-400 cursor-not-allowed bg-gray-50 flex items-center justify-between"
              >
                {item.label}
                <span className="bg-gray-200 px-1 rounded text-gray-500"><FaLock size={12} /></span>
              </span>
            );
          }

          if (item.isParent) {
            const isChildActive = item.children?.some(child => location.pathname === child.to);
            return (
              <div key={item.label} className="flex flex-col gap-1">
                <button
                  onClick={item.toggle}
                  className={`flex items-center justify-between px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isChildActive ? "text-emerald-700 font-bold" : "hover:bg-yellow-400 hover:text-black"
                  }`}
                >
                  {item.label}
                  {item.isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                </button>

                {item.isOpen && item.children?.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className={`ml-6 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      location.pathname === child.to
                        ? "bg-yellow-400 text-black shadow-sm font-bold"
                        : "text-gray-600 hover:bg-yellow-100"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to as string}
              className={`px-4 py-2 rounded-md text-base transition-all duration-200 font-medium ${
                location.pathname === item.to
                  ? "bg-yellow-400 text-black shadow-md font-bold"
                  : "hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default TrainerSideBar;