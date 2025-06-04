import { Header } from "@/components/typography/heading";
import { useNavigate } from "react-router-dom";
import StudentsTable from "./list/table";
import { useFetchStudentsInClass } from "@/services/api/students/students.queries";
import { useAuthStore } from "@/store/authStore";

export default function Students() {
  const navigate = useNavigate();
  const { assigned_class } = useAuthStore();
  const {
    data: students,
    isLoading,
    error,
  } = useFetchStudentsInClass(assigned_class?.id ?? 0);

  return (
    <section>
      {/* Header */}
      <Header
        title={`Students in ${assigned_class?.name}`}
        buttonText="Add Student"
        buttonAction={() => navigate("/teacher/students/add")}
      />
      {/* Table */}
      <StudentsTable
        data={students || []}
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
}
