
import React, { useEffect, useState,  type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setEmail, setRole } from "../../redux/slices/otpSlice";
import { useAppDispatch } from "../../redux/hooks";
import { PublicProgramsService } from "../../services/public/programs";
import signuppic from "../../assets/trainer-signup pic.webp";
import LogoHeader from "../../assets/logo.jpg";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import SubmitButton from "../../components/SubmitButton";
import SelectField from "../../components/SelectField";
import CheckboxGroup from "../../components/CheckboxGroup";
import RadioGroup from "../../components/RadioGroup";
import BackgroundImageWrapper from "../../components/BackgroundImage";
import { TrainerAuthService } from "../../services/trainer/trainer.auth";
import { type TrainerSignupDTO } from "../../types/trainerType";
import { trainerSignupValidate } from "../../validations/trainerSignupValidate";
import type { ValidationErrors } from "../../validations/ValidationErrors";
import type { DiscoveryProgram } from "../../types/programType";

const languageOptions = import.meta.env.VITE_LANGUAGES?.split(",").map((lang: string) => ({ label: lang.trim(), value: lang.trim() })) || [];
const experienceOptions = import.meta.env.VITE_EXPERIENCE?.split(",") || [];

const TrainerSignup: React.FC = () => {

  const [email, setEmailVal] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [gender, setGender] = useState<string>('');
  const [experience, setExperience] = useState<string>("");
  const [programs, setPrograms] = useState<string[]>([]);
  const [programOptions, setProgramOptions] = useState<DiscoveryProgram[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<File>();
  const [errors, setErrors] = useState<ValidationErrors<TrainerSignupDTO>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pricePerSession, setPricePerSession] = useState<string>('500');
  const [genericErrors, setGenericErrors] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FitTribe | Join as Trainer";
    const fetchServices = async () => {
      try {
        const response = await PublicProgramsService.explorePrograms('trainer');
        console.log(response)
        setProgramOptions(response.program.data);
      } catch (error) { 
        console.error(error);
       }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenericErrors('');
    setErrors({});
    
const validationData: TrainerSignupDTO = { 
    name, 
    email, 
    password, 
    confirm, 
    gender, 
    experience: Number(experience),
    certificate, 
    programs,
    languages,
    pricePerSession: Number(pricePerSession) 
  };
console.log(programs)
  const newErrors = trainerSignupValidate(validationData);   
  if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("experience", experience);
    formData.append("pricePerSession", pricePerSession);
    programs.forEach((spec) => formData.append("programs[]", spec));
    languages.forEach((lang) => formData.append("languages[]", lang));
    if (certificate) formData.append("certificate", certificate);
    try {
      const response = await TrainerAuthService.register(formData);
      if (response.success) {
        dispatch(setEmail(email));
        dispatch(setRole("trainer"));
        localStorage.setItem("startTime", Date.now().toString());
        navigate("/otp");
      }
    } catch (err: any) {
      setGenericErrors(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageWrapper image={signuppic}>
      <div className="flex justify-center md:justify-end w-full min-h-screen items-center p-4 md:pr-12 lg:pr-24 py-10">
        
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-[600px] border border-white/40 max-h-[90vh] overflow-y-auto custom-scrollbar">

          <header className="mb-8 text-center flex flex-col items-center">
            <div className="mb-4 w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
              <img src={LogoHeader} alt="FitTribe Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Trainer <span className="text-red-600">Registration</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Join our  professional network</p>
          </header>

          {genericErrors && (
            <div className="mb-6 flex items-center bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fadeIn">
              <p className="text-xs font-bold text-red-700 uppercase">{genericErrors}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Full Name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" error={errors.name} />
                <TextInput label="Email Address" name="email" type="email" value={email} onChange={(e) => setEmailVal(e.target.value)} placeholder="john@pro.com" error={errors.email} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordInput 
                  label="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  error={errors.password} 
                  showButton={true}
                />
                <PasswordInput 
                  label="Confirm" 
                  value={confirm} 
                  onChange={(e) => setConfirm(e.target.value)} 
                  placeholder="••••••••" 
                  error={errors.confirm} 
                  showButton={true} 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">Professional Credentials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <RadioGroup label="Gender" name="gender" options={["male", "female", "other"]} value={gender} onChange={(e) => setGender(e.target.value)} error={errors.gender} />
                <SelectField name="experience" label="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} options={experienceOptions} error={errors.experience} />
              </div>

              <div className="mb-6">
                <TextInput name="pricePerSession" label="Price Per Session (₹)" type="string" value={pricePerSession} onChange={(e) => setPricePerSession(e.target.value)} placeholder="Eg: 800" error={errors.pricePerSession} />
              </div>

              <div className="space-y-6">
                <CheckboxGroup 
                  label="Programs" 
                  options={programOptions.map(s => ({ label: s.name, value: s.programId }))} 
                  selected={programs} 
                  onChange={(id) => setPrograms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])} 
                  error={errors.programs} 
                />
                
                <CheckboxGroup 
                  label="Languages" 
                  options={languageOptions} 
                  selected={languages} 
                  onChange={(id) => setLanguages(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])} 
                  error={errors.languages} 
                />
              </div>

              <div className="mt-6 bg-gray-50/50 p-5 rounded-2xl border-2 border-dashed border-gray-200">
                <label className="block text-xs font-black uppercase text-gray-500 mb-3 tracking-widest text-center">Certification</label>
                <input 
                  type="file" 
                  onChange={(e) => e.target.files && setCertificate(e.target.files[0])} 
                  className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-600 file:text-white hover:file:bg-black file:transition-colors cursor-pointer" 
                />
                {errors.certificate && <p className="text-red-600 text-[10px] font-bold mt-2 uppercase">{errors.certificate}</p>}
              </div>
            </div>

            <div className="pt-4">
              <SubmitButton loading={loading} text="Create Trainer Profile" />
            </div>
          </form>

          <footer className="mt-8 text-center text-sm text-gray-500">
            Already part of the Tribe?{' '}
            <Link to="/trainer/login" className="text-black font-black hover:underline underline-offset-4 decoration-red-600 uppercase text-xs">
              Log In
            </Link>
          </footer>
        </div>
      </div>
    </BackgroundImageWrapper>
  );
};

export default TrainerSignup;