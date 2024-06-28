"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "@/api/sign-in";
import { useRouter } from "next/navigation";
type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    const signInResponse = await signIn(data);
    localStorage.setItem("token", signInResponse.data.token);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
            <Link
              className="hover:underline hover:text-blue-500 cursor-pointer"
              href={"/auth/sign-up"}
            >
              Don't have account yet ? click here to sign up!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
