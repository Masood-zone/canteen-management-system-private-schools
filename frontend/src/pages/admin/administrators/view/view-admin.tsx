import { useParams, useNavigate } from "react-router-dom";
import { useFetchAdmin } from "@/services/api/users/admin.queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ViewAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminId = Number(id);
  const { data: admin, isLoading, error } = useFetchAdmin(adminId);

  if (isLoading) return <div>Loading admin details...</div>;
  if (error || !admin) return <div>Failed to load admin details.</div>;

  return (
    <div className="py-2">
      <Button
        variant="outline"
        className="mb-4 flex items-center"
        onClick={() => navigate("/admin/administrators")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>View administrator's information</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 py-6">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {admin.name || <span className="text-muted-foreground">N/A</span>}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {admin.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {admin.phone || <span className="text-muted-foreground">N/A</span>}
          </div>
          <div>
            <span className="font-semibold">Role:</span>{" "}
            <Badge>{admin.role}</Badge>
          </div>
          <div>
            <span className="font-semibold">Gender:</span>{" "}
            {admin.gender || <span className="text-muted-foreground">N/A</span>}
          </div>
          <div>
            <span className="font-semibold">Assigned Class:</span>{" "}
            {admin.assigned_class ? (
              <span>
                {admin.assigned_class.name}{" "}
                {admin.assigned_class.description &&
                  `- ${admin.assigned_class.description}`}
              </span>
            ) : (
              <span className="text-muted-foreground">
                Supervises all classes
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
