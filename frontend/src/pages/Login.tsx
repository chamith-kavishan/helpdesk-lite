import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../auth/useAuth";
import { axiosClient, setAuthToken } from "../api/axiosClient";
import { EyeCloseIcon, EyeIcon, ProcessingIcon } from "../utils/icons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type Form = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const { saveToken } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: Form) => {
    setApiError(null);
    try {
      const res = await axiosClient.post("/auth/login", data);
      const token = res.data?.accessToken;
      if (!token) {
        throw new Error("Missing access token in response");
      }
      saveToken(token);
      setAuthToken(token);
      window.location.href = "/";
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to sign in. Please check your credentials and try again.";
      setApiError(typeof msg === "string" ? msg : "Login failed");
      // Optionally mark fields as invalid
      setError("email", { type: "server", message: "" });
      setError("password", { type: "server", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m6.92 9h-2.1a4.826 4.826 0 0 0-1.82-3.12l1.49-1.49A7.993 7.993 0 0 1 18.92 11M12 7a4 4 0 1 1-4 4a4 4 0 0 1 4-4M8.02 6.39l1.49 1.49A4.826 4.826 0 0 0 7.7 11H5.58a7.993 7.993 0 0 1 2.44-4.61M5.08 13H7.2a4.826 4.826 0 0 0 1.82 3.12l-1.49 1.49A7.993 7.993 0 0 1 5.08 13m10.9 4.39l-1.49-1.49A4.826 4.826 0 0 0 16.3 13h2.12a7.993 7.993 0 0 1-2.44 4.39"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Help Desk Admin
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign in to manage tickets and users
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          {apiError && (
            <div
              className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition
                  dark:bg-slate-900 dark:text-slate-100
                  ${
                    errors.email
                      ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-700 dark:focus:ring-rose-800/50"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:focus:ring-blue-900/40"
                  }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
              <div
                className={`relative rounded-lg ${errors.password ? "" : ""}`}
              >
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className={`block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm shadow-sm outline-none transition
                    dark:bg-slate-900 dark:text-slate-100
                    ${
                      errors.password
                        ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-700 dark:focus:ring-rose-800/50"
                        : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:focus:ring-blue-900/40"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPw ? <EyeCloseIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-blue-700/10 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
              >
                {isSubmitting && <ProcessingIcon />}
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
