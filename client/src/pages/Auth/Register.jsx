import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    workphone_no: '',
    cellphone_no: '',
    dob: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.value || e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Form Submitted:', formData);
    // Add API integration here
  };

//   console.log(formData)

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">Create an Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                className="input input-bordered w-full"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Grid for Phones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Work Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Work Phone No.</span>
                </label>
                <input
                  type="tel"
                  name="workphone_no"
                  placeholder="02112345644"
                  className="input input-bordered w-full"
                  value={formData.workphone_no}
                  onChange={handleChange}
                />
              </div>

              {/* Cell Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cell Phone No.</span>
                </label>
                <input
                  type="tel"
                  name="cellphone_no"
                  placeholder="031412345644"
                  className="input input-bordered w-full"
                  value={formData.cellphone_no}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dob"
                className="input input-bordered w-full"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
