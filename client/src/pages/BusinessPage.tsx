import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BusinessPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-card py-12 px-6 sm:px-12 lg:px-24 animate-fade-in"></div>
  );
}

export default BusinessPage;
