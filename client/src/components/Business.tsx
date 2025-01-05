import { useBusiness } from "@/hooks/use-business";
import { Loader } from "lucide-react";
import ErrorMessage from "./Error-message";
import BusinessCard from "./BusinesCard"; // assuming the correct component
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBusinessInSaved } from "@/utils/api";
import { useAuth } from "@/providers/auth-provider";

export interface Review {
  id: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface Business {
  _id: string;
  name: string;
  description: string;
  category: string;
  subscribers: string[];
  reviews: Review[];
  location: string;
}

function Business() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: business, error, isLoading } = useBusiness();

  const toggleSub = useMutation({
    mutationFn: toggleBusinessInSaved,
  });

  const handleToggle = async (businessId: string) => {
    if (!user) {
      alert("Please log in to save or unsave businesses.");
      return;
    }
    await toggleSub.mutateAsync(businessId);
    queryClient.invalidateQueries({ queryKey: ["business"] });
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!business) return null;
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {business.BusinessData.map((business: Business) => (
        <BusinessCard
          key={business._id}
          business={business}
          handleToggle={handleToggle} // Pass the handleToggle to BusinessCard
        />
      ))}
    </div>
  );
}

export default Business;
