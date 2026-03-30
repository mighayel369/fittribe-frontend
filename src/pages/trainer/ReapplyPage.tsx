import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { PublicProgramsService } from "../../services/public/programs";
import { TrainerProfileService } from "../../services/trainer/trainer.profile";
import { reapplyValidation} from "../../validations/reapplyValidation";
import {type ValidationErrors } from "../../validations/ValidationErrors";
import { type ReapplyTrainerDTO } from "../../types/trainerType";
import TextInput from "../../components/TextInput";
import SelectField from "../../components/SelectField";
import CheckboxGroup from "../../components/CheckboxGroup";
import RadioGroup from "../../components/RadioGroup";
import Toast from "../../components/Toast";
type ProgramOption = {
  programId: string;
  name: string;
  description: string;
  programPic: string;
};

const languageOptions = import.meta.env.VITE_LANGUAGES?.split(",").map((lang: string) => ({ label: lang.trim(), value: lang.trim() })) || [];
const experienceOptions = import.meta.env.VITE_EXPERIENCE?.split(",") || [];

const ReapplyPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ReapplyTrainerDTO>({
    name: "",
    gender: "",
    experience: 0,
    programs: [],
    languages: [],
    pricePerSession:0,
    certificate: null,
  });
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<ReapplyTrainerDTO>>({});
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "FitTribe | Reapply";
    
    const initData = async () => {
      try {
        const [servicesRes, profileRes] = await Promise.all([
          PublicProgramsService.explorePrograms('trainer'),
          TrainerProfileService.getProfile()
        ]);
        
        setProgramOptions(servicesRes.data);
        
        const t = profileRes.trainer;
        setFormData({
          name: t.name || "",
          gender: t.gender || "",
          experience: t.experience || 0,
          programs: t.services?.map((s: any) => s.serviceId || s.id) || [],
          pricePerSession:t.pricePerSession||0,
          languages: t.languages || [],
          certificate: null,
        });
        setCertificateUrl(t.certificate);
      } catch (err:any) {
      const errorMsg = err.response?.data?.message
      setToast({message:errorMsg,type:'error'})
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
        setFormData(prev => ({
      ...prev,
      [name]: name === "pricePerSession" || name === "experience" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (field: "programs" | "languages", value: string) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(x => x !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = reapplyValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
    const data = new FormData();
    
    (Object.keys(formData) as Array<keyof ReapplyTrainerDTO>).forEach((key) => {
      const value = formData[key];
      
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach(val => data.append(`${key}[]`, val));
      } else if (value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, String(value)); 
      }
    });

      let res=await TrainerProfileService.reapply(data);
      if(res.success){
        setToast({message:res.message,type:'success'})
        setTimeout(() => navigate("/trainer/trainer-profile"), 2000);
      }
    } catch (err:any) {
       const errorMsg = err.response?.data?.message
      setToast({message:errorMsg,type:'error'})
    }
  };

  if (loading) return <div className="p-10 ml-72">Loading...</div>;

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
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
        >
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Reapply</h1>

          <TextInput
            label="Name"
            name='name'
            placeholder="Enter name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />

          <RadioGroup
            label="Gender"
            name="gender"
            options={["male", "female", "other"]}
            value={formData.gender}
            onChange={handleInputChange}
            error={errors.gender}
          />

          <SelectField
            label="Experience"
            name='experience'
            value={formData.experience.toString()}
            onChange={handleInputChange}
            options={experienceOptions}
            error={errors.experience}
          />

          <CheckboxGroup
            label="Programs"
            options={programOptions.map(s => ({
              label: s.name,
              value: s.programId,
            }))}
            selected={formData.programs}
            onChange={(id) => handleCheckboxChange("programs", id)}
            error={errors.programs}
          />

          <CheckboxGroup
            label="Languages"
            options={languageOptions}
            selected={formData.languages}
            onChange={(val) => handleCheckboxChange("languages", val)}
            error={errors.languages}
          />

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Certification</label>
            {certificateUrl && (
              <div className="mb-2">
                <a 
                  id="existing-cert"
                  href={certificateUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                >
                  📄 View Current Certificate
                </a>
              </div>
            )}
            <input 
              type="file" 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFormData({ ...formData, certificate: e.target.files ? e.target.files[0] : null })} 
            />
            {errors.certificate && <p className="text-red-500 text-xs">{errors.certificate}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            Submit Reapplication
          </button>
        </form>
      </main>
    </div>
  );
};

export default ReapplyPage;