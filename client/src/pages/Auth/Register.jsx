import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Calendar,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Layout from "../../components/Layout";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    workphone_no: "",
    cellphone_no: "",
    dob: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.workphone_no.trim()) {
      newErrors.workphone_no = "Work phone number is required";
    }
    if (!formData.cellphone_no.trim()) {
      newErrors.cellphone_no = "Cellphone number is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      await register(formData);
      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
        <div className="card w-full max-w-2xl bg-base-100 border border-base-300 shadow-sm rounded-2xl">
          <div className="card-body p-6 sm:p-8">
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-base-content">
                Create an Account
              </h1>
              <p className="text-sm text-base-content/60 mt-1">
                Fill in the details below to register your new account
              </p>
            </div>

            {errors.form && (
              <div className="alert alert-error text-white text-sm py-3 px-4 rounded-xl flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success text-white text-sm py-3 px-4 rounded-xl flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Full Name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input input-bordered w-full pl-9 ${
                        errors.name ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-error text-xs mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="form-control md:col-span-2">
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
                      placeholder="Minimum 6 characters"
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

                {/* Address */}
                <div className="form-control md:col-span-2">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Residential Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street 12, Block B, City"
                      className={`input input-bordered w-full pl-9 ${
                        errors.address ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <span className="text-error text-xs mt-1">
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* Work Phone */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Work Phone No.
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="workphone_no"
                      value={formData.workphone_no}
                      onChange={handleChange}
                      placeholder="021-1234567"
                      className={`input input-bordered w-full pl-9 ${
                        errors.workphone_no ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.workphone_no && (
                    <span className="text-error text-xs mt-1">
                      {errors.workphone_no}
                    </span>
                  )}
                </div>

                {/* Cell Phone */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Cellphone No.
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="cellphone_no"
                      value={formData.cellphone_no}
                      onChange={handleChange}
                      placeholder="0300-1234567"
                      className={`input input-bordered w-full pl-9 ${
                        errors.cellphone_no ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.cellphone_no && (
                    <span className="text-error text-xs mt-1">
                      {errors.cellphone_no}
                    </span>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="form-control md:col-span-2">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-sm">
                      Date of Birth
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`input input-bordered w-full pl-9 ${
                        errors.dob ? "input-error" : ""
                      }`}
                    />
                  </div>
                  {errors.dob && (
                    <span className="text-error text-xs mt-1">
                      {errors.dob}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-4 font-bold shadow-xs"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="divider my-4"></div>

            <p className="text-center text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary font-medium inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}