
import UserNavBar from "../../layout/UserNavBar";
import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaHome,  FaVenusMars, FaBirthdayCake, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { validateUserProfile } from "../../validations/userProfileValidation";
import {type ValidationErrors } from "../../validations/ValidationErrors";
import {type UpdateUserProfileDTO } from "../../types/userType";
import { UserProfileService } from "../../services/user/user.profile";
import Toast from "../../components/Toast";
const EditProfile: React.FC = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState<UpdateUserProfileDTO>({
    name: "",
    phone: "",
    address: "",
    gender: "",
    age: undefined,
    profilePic: ""
  });

  const [errors, setErrors] = useState<ValidationErrors<UpdateUserProfileDTO>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "FitTribe | Edit Profile";
    const fetchUserProfile = async () => {
      try {
        const res = await UserProfileService.getProfile();
        setFormData(res.userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateUserProfile(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await UserProfileService.updateProfile(formData);
      if (res.success) {
        navigate('/profile',{
          state:{
            message:res.message
          }
        });
      }
    } catch (err:any) {
      let errMesg=err.response?.data?.message
      setToast({message:errMesg,type:'error'})
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <UserNavBar />
      <main className="min-h-screen bg-[#F8FAFC] pt-[120px] pb-12 px-4">
              {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Edit Profile</h1>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 p-8 flex justify-center">
                <div className="relative">
                    <img 
                        src={formData.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        alt="Profile"
                    />
                </div>
            </div>

            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className={`flex items-center border-2 rounded-2xl px-4 transition-all ${errors.name ? 'border-red-500' : 'border-gray-50 focus-within:border-gray-900'}`}>
                    <FaUser className="text-gray-400 mr-3" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full py-3 outline-none text-sm font-semibold" />
                  </div>
                  {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="flex items-center border-2 border-gray-50 rounded-2xl px-4 focus-within:border-gray-900 transition-all">
                    <FaPhone className="text-gray-400 mr-3" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full py-3 outline-none text-sm font-semibold" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.phone}</p>}
                </div>

            
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Age</label>
                  <div className="flex items-center border-2 border-gray-50 rounded-2xl px-4 focus-within:border-gray-900 transition-all">
                    <FaBirthdayCake className="text-gray-400 mr-3" />
                    <input type="number" name="age" value={formData.age ?? ""} onChange={handleChange} className="w-full py-3 outline-none text-sm font-semibold" />
                  </div>
                  {errors.age && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.age}</p>}
                </div>

            
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                  <div className="flex items-center border-2 border-gray-50 rounded-2xl px-4 focus-within:border-gray-900 transition-all">
                    <FaVenusMars className="text-gray-400 mr-3" />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full py-3 outline-none text-sm font-semibold bg-transparent">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.gender}</p>}
                </div>
              </div>

       
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
                <div className="flex items-start border-2 border-gray-50 rounded-2xl px-4 py-3 focus-within:border-gray-900 transition-all">
                  <FaHome className="text-gray-400 mt-1 mr-3" />
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full outline-none text-sm font-semibold resize-none" />
                </div>
                {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.address}</p>}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditProfile;