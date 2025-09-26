import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../auth/useAuth";
import { axiosClient } from "../../api/axiosClient";
import {
  EmailIcon,
  EyeCloseIcon,
  EyeIcon,
  PasswordIcon,
  ProcessingIcon,
} from "../../utils/icons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().nonempty("Password is required"),
});
type Form = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const { saveToken, setUser } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (data: Form) => {
    try {
      const res = await axiosClient.post("/auth/login", data);
      const token = res.data?.accessToken;
      if (!token) {
        throw new Error("Missing access token in response");
      }
      setUser(res.data.user);
      saveToken(token);
      navigate("/");
    } catch (err: any) {
      console.log(err);
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to sign in. Please check your credentials and try again.";
      toast.error(msg);
      setError("email", { type: "server", message: "" });
      setError("password", { type: "server", message: "" });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-adminBgColor">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-[30px] md:text-[40px] text-center">
          <span className="text-white">Welcome back to </span>
          <br />
          <span className="text-green">HelpDesk Mini</span>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[300px] md:w-[390px] mt-6 md:mt-10 flex flex-col gap-5"
        >
          {/* Email field */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] 
            ${
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

          {/* Password field */}
          <div
            className={`flex items-center rounded-lg text-sm md:text-base px-3 py-2 h-[40px] md:h-[50px] 
            ${
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white justify-center w-full mt-5 bg-[#00A36C] rounded-[10px] h-fit px-10 py-2 hover:bg-opacity-80 duration-300 transition-all flex gap-2 items-center"
          >
            {isSubmitting && <ProcessingIcon />}
            Sign In
          </button>

          <p className="text-white text-sm text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
