import { useQuery } from "@tanstack/react-query";
import { fetchAdmin } from "./admin.api";
import { toast } from "sonner";

export const useFetchAdmin = (id: number) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => fetchAdmin(id),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch admin details.");
    },
  });
};
