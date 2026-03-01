import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-serif font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Button
        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md"
        onClick={() => navigate("/auth")}
      >
        Back to Login
      </Button>
    </div>
  );
};
