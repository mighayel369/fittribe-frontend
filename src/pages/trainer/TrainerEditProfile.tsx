import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";
import SelectField from "../../components/SelectField";
import CheckboxGroup from "../../components/CheckboxGroup";
import RadioGroup from "../../components/RadioGroup";
import Toast from "../../components/Toast";
import {type ValidationErrors } from "../../validations/ValidationErrors";
import { trainerProfileValidation} from "../../validations/trainerProfileValidation";
import { TrainerProfileService } from "../../services/trainer/trainer.profile";
import { type UpdateTrainerProfileDTO } from "../../types/trainerType";
import { PublicProgramsService } from "../../services/public/programs";
import type { DiscoveryProgram } from "../../types/programType";
const TrainerEditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UpdateTrainerProfileDTO>({
    name: '',
    gender: "",
    experience: 0,
    languages: [],
    bio: "",
    phone: "",
    address: "",
    pricePerSession: 0,
    programs: [], 
  });

  const [programOptions, setProgramOptions] = useState<DiscoveryProgram[]>([]);
   const [errors, setErrors] = useState<ValidationErrors<UpdateTrainerProfileDTO>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [programRes, profileRes] = await Promise.all([
          PublicProgramsService.explorePrograms(),
          TrainerProfileService.getProfile()
        ]);
        console.log(programRes,profileRes)
        setProgramOptions(programRes.program.data);
        
        const t = profileRes.trainer;
        setFormData({
          ...t,
          programs: t.programs?.map((s: any) => s.programId) || [],
          experience: Number(t.experience) || 0,
          pricePerSession: Number(t.pricePerSession) || 0
        });
      } catch (err:any) {
      const errMesg=err.response?.data?.message
      setToast({ message: errMesg, type: "error" });
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "pricePerSession" || name === "experience" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (field: "programs" | "languages", value: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value) 
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const validationErrors = trainerProfileValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setActionLoading(false);
      return;
    }

    try {
      const data = new FormData();
      
      (Object.keys(formData) as Array<keyof UpdateTrainerProfileDTO>).forEach((key) => {
        const value = formData[key];
        
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach(val => data.append(`${key}[]`, val));
        } else {
          data.append(key, value.toString());
        }
      });

      const res = await TrainerProfileService.updateProfile(data);
      if (res.success) {
        navigate('/trainer/trainer-profile',{
          state:{
            message:res.message
          }
        })
      }
    } catch (err:any) {
      const errMesg=err.response?.data?.message
      setToast({ message: errMesg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerTopBar />
      <TrainerSideBar />
      
      <main className="ml-72 pt-24 px-10 pb-12">
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
            Edit Profile
          </h1>
          
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6"
          >
            <TextInput
              name='name'
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name||''}
              onChange={handleChange}
              error={errors.name}
            />

            <div className="grid grid-cols-2 gap-6">
              <RadioGroup
                label="Gender"
                name="gender"
                options={["male", "female", "other"]}
                value={formData.gender || ""}
                onChange={handleChange}
                error={errors.gender}
              />
              <SelectField
                label="Experience (Years)"
                name='experience'
                value={formData.experience?.toString()}
                options={import.meta.env.VITE_EXPERIENCE?.split(",") || []}
                onChange={handleChange}
                error={errors.experience}
              />
            </div>

            <TextInput
              label="Price Per Session (₹)"
              name="pricePerSession"
              type="number"
              value={formData.pricePerSession?.toString() || ""}
              onChange={handleChange}
              error={errors.pricePerSession}
            />

            <CheckboxGroup
              label="Programs"
              options={programOptions.map(s => ({ 
                label: s.name, 
                value: s.programId 
              }))}
              selected={formData.programs}
              onChange={(val) => handleCheckboxChange("programs", val)}
              error={errors.programs}
            />

            <CheckboxGroup
              label="Languages"
              options={import.meta.env.VITE_LANGUAGES?.split(",").map((l: string) => ({
                label: l.trim(),
                value: l.trim()
              })) || []}
              selected={formData.languages || []}
              onChange={(val) => handleCheckboxChange("languages", val)}
              error={errors.languages}
            />

            <TextInput
              label="Bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              error={errors.bio}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <TextInput
                name="phone"
                label="Phone"
                value={formData.phone || ""}
                onChange={handleChange}
                error={errors.phone}
              />
              <TextInput
                name="address"
                label="Address"
                value={formData.address||''}
                onChange={handleChange}
                error={errors.address}
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <SubmitButton
                text="Save Changes"
                loading={actionLoading}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TrainerEditProfile;