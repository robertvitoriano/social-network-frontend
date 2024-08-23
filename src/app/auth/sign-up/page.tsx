"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signUp } from "@/api/sign-up";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { signInGoogle } from "@/api/sign-in-google";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
type SignUpFormInputs = {
  name: string;
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormInputs>();

  const password = watch("password");
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setLoggedUser = useAuthStore((state) => state.setLoggedUser);

  const onSubmit = async (data: SignUpFormInputs) => {
    const signUpResponse = await signUp(data);
    setLoggedUser(signUpResponse.data.user);
    setToken(signUpResponse.data.token);
    location.href = "/";
  };
  const handleGoogleSignUp = async () => {
    await signInGoogle();
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-primary p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>

          <div className="flex flex-col gap-4 mt-4 items-center">
            <GoogleLoginButton handler={handleGoogleSignUp} />
            <Link
              className="hover:underline hover:text-blue-500 cursor-pointer"
              href={"/auth/sign-in"}
            >
              Go back to login page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
