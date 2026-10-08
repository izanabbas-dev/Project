import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import Layout from "../../components/Layout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(formData);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
        <div className="card w-full max-w-md bg-base-100 border border-base-300 shadow-sm rounded-2xl">
          <div className="card-body p-6 sm:p-8">
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-base-content">
                Welcome Back
              </h1>
              <p className="text-sm text-base-content/60 mt-1">
                Enter your credentials to access your account
              </p>
            </div>

            {errors.form && (
              <div className="alert alert-error text-white text-sm py-3 px-4 rounded-xl flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`input input-bordered w-full pl-9 ${
                      errors.email ? "input-error" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-error text-xs mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium text-sm">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-9 pr-10 ${
                      errors.password ? "input-error" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-xs mt-1">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2 font-bold shadow-xs"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider my-4"></div>

            <p className="text-center text-sm text-base-content/70">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="link link-primary font-medium inline-flex items-center gap-1"
              >
                Create Account <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}