import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate()
  const { register } = useContext(AuthContext)

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.cellphone_no.trim())
      newErrors.cellphone_no = "Cellphone number is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await register(formData)
      alert("Registration successful!");
      navigate('/login')
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-2">
            Create an Account
          </h2>

          {errors.form && (
            <div className="alert alert-error text-sm py-2">
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
              />
              {errors.name && (
                <span className="text-error text-xs mt-1">{errors.name}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
              />
              {errors.email && (
                <span className="text-error text-xs mt-1">{errors.email}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
              />
              {errors.password && (
                <span className="text-error text-xs mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, Area, City"
                className={`input input-bordered w-full ${
                  errors.address ? "input-error" : ""
                }`}
              />
              {errors.address && (
                <span className="text-error text-xs mt-1">
                  {errors.address}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Work Phone No.</span>
                </label>
                <input
                  type="tel"
                  name="workphone_no"
                  value={formData.workphone_no}
                  onChange={handleChange}
                  placeholder="021-12345644"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cellphone No.</span>
                </label>
                <input
                  type="tel"
                  name="cellphone_no"
                  value={formData.cellphone_no}
                  onChange={handleChange}
                  placeholder="0314-12345644"
                  className={`input input-bordered w-full ${
                    errors.cellphone_no ? "input-error" : ""
                  }`}
                />
                {errors.cellphone_no && (
                  <span className="text-error text-xs mt-1">
                    {errors.cellphone_no}
                  </span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`input input-bordered w-full ${
                  errors.dob ? "input-error" : ""
                }`}
              />
              {errors.dob && (
                <span className="text-error text-xs mt-1">{errors.dob}</span>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <a href="/login" className="link link-primary">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}