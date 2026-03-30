import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { useEffect, useState } from "react";
import { AdminTrainerService } from "../../services/admin/admin.trainer.service";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import { type PendingTrainer } from "../../types/trainerType";

const VerifyTrainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [trainers, setTrainers] = useState<PendingTrainer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "FitTribe | Trainer Verification";
  }, []);
const fetchTrainers = async () => {
  setLoading(true);
  try {
    const response = await AdminTrainerService.getPendingTrainers(page, search);

    if (response.success) {
      setTrainers(response.data);
      setTotalPages(response.total);
    }
  } catch (err) {
    console.error("Failed to fetch trainers", err);
  } finally {
    setLoading(false);
  }
};

  const handleVerify = (trainerId: string) => {
   navigate(`/admin/trainers/${trainerId}`);
  };

  useEffect(() => {
    fetchTrainers();
  }, [page, search]);

  return (
    <>
      <AdminTopBar />
      <AdminSideBar />
      <main className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen relative">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Trainer Verification</h2>
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search trainers..."
            fullWidth={false}

          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <GenericTable<PendingTrainer>
            data={trainers}
            columns={[
              { header: "Name", accessor: "name" },
              {
                header: "Gender",
                accessor: "gender",
                render: (t) => t.gender ?? "NA",
              },
              {
                 header: "Programs",
                 accessor: "programs",
                 render: (t) => t.programs.length ? t.programs.join(", ") : "NA",
                },
              {
                  header: "Price",
                  accessor: "pricePerSession",
                  render: (t) => t.pricePerSession ? `₹${t.pricePerSession}` : "NA",
                },
              {
                header: "Action",
                accessor: "action",
                render: (t) => (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                    onClick={() => handleVerify(t.trainerId)}
                  >
                    Verify
                  </button>
                ),
                className: "text-center",
              },
            ]}
            page={page}
            loading={loading}
            emptyMessage="No Trainers Found."
          />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        </div>
      </main>
    </>
  );
};

export default VerifyTrainer;
