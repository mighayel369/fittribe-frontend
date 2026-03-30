import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { useEffect, useState, useCallback } from "react";
import { AdminProgramService } from "../../services/admin/admin.program.service";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import GenericTable from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { type Program } from "../../types/programType";
import { useLocation } from "react-router-dom";
type ActionType = "list" | "unlist" | "delete" | null;

const ProgramList = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  let location=useLocation()
  useEffect(() => {
      if (location.state?.message) {
        setToastMessage(location.state.message);
  
        window.history.replaceState({}, document.title);
      }
    }, [location]);
  useEffect(() => {
    document.title = "FitTribe | Program Management";
  }, []);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AdminProgramService.fetchProgramsInventory(page, search);
      setPrograms(response.programs.data?? []);
      setTotalPages(response.programs.total ?? 1);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const openModal = (program: Program, action: ActionType) => {
    setSelectedProgram(program);
    setActionType(action);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedProgram || !actionType) return;

    const targetId = selectedProgram.programId;

    try {
      if (actionType === "delete") {
        await AdminProgramService.archiveProgram(targetId);
        setToastType("success");
        setToastMessage("Program archived successfully");
        fetchPrograms();
      } else if (actionType === "list" || actionType === "unlist") {
        const isVisible = actionType === "list";
        const response = await AdminProgramService.toggleProgramVisibility(targetId, isVisible);
        
        setPrograms((prev) =>
          prev.map((p) =>
            p.programId === targetId ? { ...p, isPublished: isVisible } : p
          )
        );
        
        setToastType("success");
        setToastMessage(response.message || `Program successfully ${actionType}ed`);
      }
    } catch (error: any) {
      console.error(`Error during ${actionType}:`, error);
      setToastType("error");
      setToastMessage(error.response?.data?.message || "Action failed");
    } finally {
      setShowModal(false);
      setSelectedProgram(null);
      setActionType(null);
    }
  };

  const handleAdd = () => {
    navigate("/admin/programs/onboard-new");
  };

  return (
    <>
      <AdminTopBar />
      <AdminSideBar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
                    <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Programs Inventory</h1>
            <p className="text-slate-500 font-medium">Manage programs and access control.</p>
          </div>
          <div className="flex gap-4 items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search programs..."
              fullWidth={false}
            />
            <button 
              className="flex items-center gap-2 px-5 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition" 
              onClick={handleAdd}
            >
              <FaPlus size={14} /> Onboard New
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <GenericTable<Program>
            data={programs}
            page={page}
            loading={loading}
            columns={[
              {
                header: "Image",
                accessor: "programPic",
                render: (program) => (
                  <img
                    src={program.programPic}
                    alt={program.name}
                    className="w-14 h-14 rounded-md object-cover mx-auto border"
                  />
                ),
                className: "text-center",
              },
              { header: "Program Name", accessor: "name", className: "font-semibold" },
              {
                header: "Status",
                accessor: "status",
                render: (program) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      program.isPublished
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-orange-100 text-orange-700 border border-orange-200"
                    }`}
                  >
                    {program.isPublished ? "Public" : "Hidden"}
                  </span>
                ),
                className: "text-center",
              },
              {
                header: "Visibility",
                accessor: "action",
                render: (program) => (
                  <button
                    className={`px-4 py-1 text-white rounded-md text-xs font-bold transition-colors ${
                      program.isPublished
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() =>
                      openModal(program, program.isPublished ? "unlist" : "list")
                    }
                  >
                    {program.isPublished ? "Unlist" : "List"}
                  </button>
                ),
                className: "text-center",
              },
              {
                header: "Manage",
                accessor: "manage",
                render: (program) => (
                  <div className="flex justify-center gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                      title="Edit Program"
                      onClick={() =>
                        navigate(`/admin/programs/modify/${program.programId}`)
                      }
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                      title="Archive Program"
                      onClick={() => openModal(program, "delete")}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                ),
                className: "text-center",
              },
            ]}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {showModal && selectedProgram && actionType && (
          <Modal
            isVisible={showModal}
            title={`${actionType === 'delete' ? 'Archive' : 'Toggle'} Program: ${selectedProgram.name}`}
            message={`Are you sure you want to ${
              actionType === "delete" ? "archive" : actionType
            } this program? This affects how users see it on the platform.`}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirmAction}
          />
        )}
      </main>
    </>
  );
};

export default ProgramList;