import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMutation } from "@tanstack/react-query";
import { Role, signUp, User } from "@/utils/api";

const SignUp = () => {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    role: undefined,
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const { mutateAsync: addNewUserMutation } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      setMessage({ type: "success", text: "User registered successfully!" });
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);

      const errorMessage = error.message || "An error occurred.";
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field.trim())) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long!",
      });
      return;
    }
    try {
      await addNewUserMutation(formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        role: undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleToggle = (selectedRole: Role | undefined) => {
    setFormData((prevData) => ({
      ...prevData,
      role: prevData.role === selectedRole ? undefined : selectedRole,
    }));
  };

  // Handle input changes
  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-primary shadow-lg rounded-lg p-8 text-black">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mt-4 text-foreground">Sign up</h1>
        </div>
        {message.text && (
          <p
            className={`text-sm text-center mb-4 ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              name="phone"
              type="number"
              placeholder="Mobile number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              name="firstName"
              type="text"
              placeholder="first name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              name="lastName"
              type="text"
              placeholder="last name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Role Toggle Buttons */}
          <div className="flex justify-center mt-4 gap-4">
            <HoverCard>
              <HoverCardTrigger>
                <button
                  type="button"
                  onClick={() => handleRoleToggle("user")}
                  className={`w-32 h-10 ${
                    formData.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-gray-300 rounded-lg flex items-center justify-center`}
                >
                  Customer
                </button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="text-sm text-gray-700">
                  **Customer Capabilities**:
                  <ul className="list-disc list-inside">
                    <li>Save businesses for quick access.</li>
                    <li>Leave reviews to share experiences.</li>
                    <li>
                      Subscribe to businesses for updates and notifications.
                    </li>
                    <li>
                      <span className="text-red-600">Note:</span> Cannot create
                      or modify businesses.
                    </li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <button
                  type="button"
                  onClick={() => handleRoleToggle("owner")}
                  className={`w-32 h-10 ${
                    formData.role === "owner"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-gray-300 rounded-lg flex items-center justify-center`}
                >
                  Owner
                </button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="text-sm text-gray-700">
                  **Business Owner Capabilities**:
                  <ul className="list-disc list-inside">
                    <li>Create businesses based on your plan:</li>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        <b>Standard:</b> 1 business (Free).
                      </li>
                      <li>
                        <b>Gold:</b> Up to 3 businesses.
                      </li>
                      <li>
                        <b>Platinum:</b> Up to 10 businesses.
                      </li>
                    </ul>
                    <li>Perform full CRUD operations on your businesses.</li>
                    <li>Cannot save or subscribe to your own businesses.</li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-black hover:bg-destructive text-white py-2 px-4 rounded-lg transition-colors"
          >
            Sign up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Have an account?{" "}
            <span
              className="text-popover hover:underline cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
