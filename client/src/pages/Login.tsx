import { useAuth, UserFromToken } from "@/providers/auth-provider";
import { signIn } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [btnText, setBtnText] = useState("Log In");
  const [errorMessage, setErrorMessage] = useState("");
  const passRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setUser, user } = useAuth();

  const { mutateAsync: signInAndGetToken } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setUser({
        id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        plan: data.user.plan,
      });

      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      const errorMessageFromApi = error.error || "An error occurred.";
      setErrorMessage(errorMessageFromApi);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passRef.current?.value || "";
    const userData = {
      username: userName,
      password,
    };
    try {
      await signInAndGetToken(userData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-primary shadow-lg rounded-lg p-8 text-black">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mt-4 text-foreground">Log In</h1>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              id="userName"
              name="userName"
              placeholder="Username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              ref={passRef}
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errorMessage && (
            <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="w-full bg-black hover:bg-destructive text-white py-2 px-4 rounded-lg transition-colors"
          >
            {btnText}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-popover hover:underline cursor-pointer"
              onClick={() => navigate("/signUp")}
            >
              Sign up
            </span>
          </p>
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="h-px bg-gray-300 flex-grow"></div>
          </div>
          <p className="text-sm text-gray-600">
            Log in as{" "}
            <span
              className="text-popover hover:underline cursor-pointer"
              onClick={() => navigate("/")}
            >
              Guest
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
