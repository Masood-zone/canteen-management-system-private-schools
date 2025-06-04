import { Header } from "@/components/typography/heading";
import { useNavigate } from "react-router-dom";
import ExpensesTable from "./list/expenses/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ReferencesTable from "./list/references/references-table";
import OverallTotals from "./overall/overall";

export default function Expenses() {
  const navigate = useNavigate();

  return (
    <section className="container py-5 px-4 w-full">
      {/* Header */}

      <Header
        title="Accounts"
        buttonText="Setup Accounts"
        buttonAction={() => navigate("/admin/accounts/add")}
      />

      {/* Table Tabs*/}
      <Tabs defaultValue="accounts" className="w-full mt-5">
        <TabsList>
          <TabsTrigger value="accounts">Acconuts</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts">
          <ExpensesTable />
        </TabsContent>
        {/* <TabsContent value="references">
          <ReferencesTable />
        </TabsContent> */}
        <TabsContent value="revenue">
          <OverallTotals />
        </TabsContent>
      </Tabs>
    </section>
  );
}
