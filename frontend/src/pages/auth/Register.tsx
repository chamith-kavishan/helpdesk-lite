import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { axiosClient } from "../../api/axiosClient";
import {
  EmailIcon,
  EyeCloseIcon,
  EyeIcon,
  PasswordIcon,
  ProcessingIcon,
  UserIcon,
} from "../../utils/icons";

const schema = z
  .object({
    name: z.string().nonempty("Enter a name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Form = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const onSubmit = async (data: Form) => {
    try {
      await axiosClient.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created.");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to sign up. Please try again.";
      toast.error(msg);

      setError("name", { type: "server", message: "" });
      setError("email", { type: "server", message: "" });
      setError("password", { type: "server", message: "" });
      setError("confirmPassword", { type: "server", message: "" });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-adminBgColor">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-[30px] md:text-[40px] text-center">
          <span className="text-white">Create your account</span>
          <br />
          <span className="text-green">HelpDesk Mini</span>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[300px] md:w-[390px] mt-6 md:mt-10 flex flex-col gap-5"
        >
          {/* Name */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] ${
              errors.name ? "border border-red-500" : "border border-[#3E3E3E]"
            }`}
          >
            <UserIcon />
            <input
              id="name"
              type="text"
              placeholder="Name"
              {...register("name")}
              className="ml-5 bg-transparent outline-none text-white placeholder:text-[#959CA3] w-full"
            />
          </div>
          {errors.name && (
            <p className="text-red text-sm">{errors.name.message}</p>
          )}

          {/* Email */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] ${
              errors.email ? "border border-red-500" : "border border-[#3E3E3E]"
            }`}
          >
            <EmailIcon />
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className="ml-5 bg-transparent outline-none text-white placeholder:text-[#959CA3] w-full"
            />
          </div>
          {errors.email && (
            <p className="text-red text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] ${
              errors.password
                ? "border border-red-500"
                : "border border-[#3E3E3E]"
            }`}
          >
            <PasswordIcon />
            <input
              id="password"
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="Password"
              className="ml-5 bg-transparent outline-none text-white placeholder:text-[#959CA3] w-full"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="focus:outline-none text-[#E1E1E1]"
            >
              {showPw ? <EyeCloseIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red text-sm">{errors.password.message}</p>
          )}

          {/* Confirm Password */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] ${
              errors.confirmPassword
                ? "border border-red-500"
                : "border border-[#3E3E3E]"
            }`}
          >
            <PasswordIcon />
            <input
              id="confirmPassword"
              {...register("confirmPassword")}
              type={showConfirmPw ? "text" : "password"}
              placeholder="Confirm Password"
              className="ml-5 bg-transparent outline-none text-white placeholder:text-[#959CA3] w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPw((s) => !s)}
              className="focus:outline-none text-[#E1E1E1]"
            >
              {showConfirmPw ? <EyeCloseIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red text-sm">{errors.confirmPassword.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white justify-center w-full mt-5 bg-[#00A36C] rounded-[10px] h-fit px-10 py-2 hover:bg-opacity-80 duration-300 transition-all flex gap-2 items-center"
          >
            {isSubmitting && <ProcessingIcon />}
            Sign Up
          </button>

          <p className="text-white text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
