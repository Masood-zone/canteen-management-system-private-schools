import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Users } from "lucide-react";
import SetupCanteen from "./list/setup-canteen";
import Owings from "../owings/owings";

export default function SetupCanteenTabs() {
  const [activeTab, setActiveTab] = useState("canteen");

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:px-5 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Admin Canteen Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {activeTab === "canteen"
              ? "Setup and manage daily canteen records for students"
              : "Track and manage students with outstanding payments"}
          </p>
        </div>
        <Tabs
          defaultValue="canteen"
          className="w-full sm:w-[400px]"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="canteen"
              className="flex items-center justify-center text-xs sm:text-base"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Canteen Setup
            </TabsTrigger>
            <TabsTrigger
              value="owings"
              className="flex items-center justify-center text-xs sm:text-base"
            >
              <Users className="h-4 w-4 mr-2" />
              Student Owings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs
        defaultValue="canteen"
        onValueChange={setActiveTab}
        value={activeTab}
        className="w-full"
      >
        <TabsContent value="canteen" className="w-full">
          <div className="w-full overflow-x-auto">
            <SetupCanteen />
          </div>
        </TabsContent>
        <TabsContent value="owings" className="w-full">
          <div className="w-full overflow-x-auto">
            <Owings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
