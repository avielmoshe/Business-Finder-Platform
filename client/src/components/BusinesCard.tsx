import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Business } from "./Business";
import { useAuth } from "@/providers/auth-provider";

interface BusinessCardProps {
  business: Business;
  handleToggle: (businessId: string) => void; // Receiving handleToggle from parent
}

function BusinessCard({ business, handleToggle }: BusinessCardProps) {
  const { user } = useAuth();

  return (
    <Card className="max-w-sm rounded-lg overflow-hidden shadow-lg">
      <Link to={`/businessPage/${business._id}`}>
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-semibold text-primary">
            {business.name}
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            {business.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm">{`Category: ${business.category}`}</p>
          <p className="text-sm">{`Location: ${business.location}`}</p>
        </CardContent>
        <CardFooter className="p-4 flex flex-col">
          {`Subscribers: ${business.subscribers.length}`}
        </CardFooter>
      </Link>
      <div className="flex justify-end mx-3 mb-3 w-[50px]">
        <button
          className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
          onClick={() => handleToggle(business._id)} // Handle click to toggle subscription
        >
          {business.subscribers.includes(user?.id) ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>
    </Card>
  );
}

export default BusinessCard;
