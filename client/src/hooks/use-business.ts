import { getAllBusiness } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export function useBusiness() {
  return useQuery({
    queryKey: ["business"],
    queryFn: () => getAllBusiness(),
    // retry: 1,
    // gcTime: 5000, // default to 5 minute
    // refetchOnWindowFocus: false, // default to 5 true
  });
}
