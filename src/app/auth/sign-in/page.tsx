"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "@/api/sign-in";
import { useAuthStore } from "@/lib/store/authStore";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { signInGoogle } from "@/api/sign-in-google";

type LoginFormInputs = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const setLoggedUser = useAuthStore((state: any) => state.setLoggedUser);
  const setToken = useAuthStore((state: any) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const onSubmit = async (data: LoginFormInputs) => {
    const signInResponse = await signIn(data);
    setLoggedUser(signInResponse.data.user);
    setToken(signInResponse.data.token);
    location.href = "/";
  };

  const handleGoogleLogin = async () => {
    await signInGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-primary p-6 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex flex-col gap-2 items-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <div className="flex flex-col gap-4 mt-4 items-center">
              <GoogleLoginButton handler={handleGoogleLogin} />
              <Link
                className="hover:underline hover:text-blue-500  cursor-pointer"
                href={"/auth/sign-up"}
              >
                Don't have an account yet? Click here to sign up!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
