import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ navigation hook
import {
  DollarSign,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "demo@example.com",
    password: "password",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false); // ✅ toggle for demo creds

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // ✅ if login is successful, navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Logo + Title */}
        <div>
          <div className="flex justify-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <DollarSign className="h-10 w-10 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            BuddySpend
          </h2>

          {/* Toggle demo credentials */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
            >
              <Info className="h-4 w-4" />
              {showDemo ? "Hide demo credentials" : "Show demo credentials"}
            </button>
            {showDemo && (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-2 text-sm text-gray-700">
                <p>
                  <strong>Email:</strong> demo@example.com
                </p>
                <p>
                  <strong>Password:</strong> password
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md animate-shake">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg text-black bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
