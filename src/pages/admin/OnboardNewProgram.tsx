import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import GenericForm from "../../components/GenericForm";
import { AdminProgramService } from "../../services/admin/admin.program.service";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { programValidate } from "../../validations/programValidate";
import { validateImageFile } from '../../validations/validateImageFile';
import { type ValidationErrors } from "../../validations/ValidationErrors";
import { type OnboardNewProgramDTO } from "../../types/programType";
import { PROGRAM_FIELDS } from "../../constants/FormFields/program-fields";

const OnboardNewProgram = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<ValidationErrors<OnboardNewProgramDTO>>({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    document.title = "FitTribe | Onboard New Program";
  }, []);

  const handleSubmit = async (values: Record<string, any>) => {
    setFormErrors({});

    const validationPayload = {
      name: values.name,
      description: values.description,
    } as OnboardNewProgramDTO;

    const errors = programValidate(validationPayload);
    const imageError = validateImageFile(values.programPic, { required: true });

    if (imageError) errors.programPic = imageError;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await AdminProgramService.onboardNewProgram(formData);
      if (response.success) {
        navigate("/admin/programs", { state: { message: response.message } });
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 mt-16 p-8 transition-all duration-300">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Create New Program
            </h2>
            <p className="text-gray-500 mt-1">
              Fill in the details below to add a new training program to the platform.
            </p>
          </div>

          <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-8 border border-gray-100">
            <GenericForm
              fields={PROGRAM_FIELDS}
              onSubmit={handleSubmit}
              buttonText="Confirm & Publish Program"
              loading={isLoading}
              externalErrors={formErrors}
            />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2"
          >
            ← Back to Program List
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardNewProgram;