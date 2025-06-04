import { Header } from "@/components/typography/heading";
import { useNavigate } from "react-router-dom";
import AdminsTable from "./list/table";
import { useFetchAdmins } from "@/services/api/admins/admins.queries";

export default function Administrators() {
  const navigate = useNavigate();
  const { data: admins, isLoading, error } = useFetchAdmins();

  return (
    <section className="">
      {/* Header */}
      <Header
        title="Admins"
        buttonText="Add Admin"
        buttonAction={() => navigate("/admin/administrators/add")}
      />
      {/* Table */}
      <AdminsTable data={admins || []} isLoading={isLoading} error={error} />
    </section>
  );
}
