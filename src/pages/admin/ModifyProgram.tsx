import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import GenericForm from "../../components/GenericForm";
import { AdminProgramService } from "../../services/admin/admin.program.service";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { programValidate } from "../../validations/programValidate";
import { validateImageFile } from '../../validations/validateImageFile';
import Toast from "../../components/Toast";
import { PROGRAM_FIELDS } from "../../constants/FormFields/program-fields";
import { type ModifyProgramDTO } from "../../types/programType";
import { type ValidationErrors } from "../../validations/ValidationErrors";

const ModifyProgram = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState<ModifyProgramDTO>({});
  const [existingImage, setExistingImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); 
  const [formErrors, setFormErrors] = useState<ValidationErrors<ModifyProgramDTO>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "FitTribe | Modify Program";
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProgramDetails = async () => {
      try {
        const response = await AdminProgramService.getProgramDetails(id);
        const programData = response.data || response.program;

        setInitialValues({
          name: programData.name,
          description: programData.description,
          programPic: undefined
        });

        setExistingImage(programData.programPic);
      } catch (error: any) {
        setToast({ 
            message: error.response?.data?.message || "Failed to load program", 
            type: "error" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id]);

  const handleSubmit = async (values: Record<string, any>) => {
    setFormErrors({});
    
    const validationPayload = {
      name: values.name,
      description: values.description,
      duration: Number(values.duration),
    } as any;

    const errors = programValidate(validationPayload);

    if (values.programPic instanceof File) {
      const imageError = validateImageFile(values.programPic, { required: false });
      if (imageError) errors.programPic = imageError;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("duration", values.duration.toString());

      if (values.programPic instanceof File) {
        formData.append("programPic", values.programPic);
      }

      const response = await AdminProgramService.modifyProgram(id!, formData);

      if (response.success) {
        navigate("/admin/programs",{
          state:{
            message:'Program Updated Successfully'
          }
        })
      }
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || "Update failed", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminTopBar />
        <div className="flex flex-1">
          <AdminSideBar />
          <main className="flex-1 ml-64 mt-16 flex items-center justify-center">
            <Loading />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 mt-16 p-8 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
        
          <div className="flex flex-col gap-2 mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Modify Program
            </h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full" /> 
            <p className="text-slate-500 text-lg mt-2">
              Adjust the details, timing, or imagery for this training program.
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-10 border border-slate-100">
            {existingImage && (
              <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Currently Active Image
                </span>
                <img
                  src={existingImage}
                  alt="Existing"
                  className="w-full h-48 object-cover rounded-xl shadow-sm border border-white"
                />
              </div>
            )}

            <GenericForm
              fields={PROGRAM_FIELDS}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              buttonText="Update Changes"
              loading={isUpdating}
              externalErrors={formErrors}
            />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 text-sm font-semibold text-slate-400 hover:text-amber-600 transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Discard Changes and Return
          </button>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ModifyProgram;