import React, { useState } from "react";
import Layout from "../components/Layout";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-base-content">Contact Customer Support</h1>
          <p className="text-sm text-base-content/60 max-w-md mx-auto">
            Have questions about orders, products, or services? We're here to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm p-5 rounded-xl text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Call Us</h3>
            <p className="text-xs text-base-content/60 mt-1">+1 (800) 555-0199</p>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm p-5 rounded-xl text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Email Us</h3>
            <p className="text-xs text-base-content/60 mt-1">support@eshop.com</p>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm p-5 rounded-xl text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Location</h3>
            <p className="text-xs text-base-content/60 mt-1">742 Evergreen Terrace, NY</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm rounded-xl p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Message Sent Successfully!</h3>
              <p className="text-xs text-base-content/60">
                Our support team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Your Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="input input-bordered input-sm sm:input-md w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Your Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="input input-bordered input-sm sm:input-md w-full"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold">Subject</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Order Inquiry / Feedback"
                  className="input input-bordered input-sm sm:input-md w-full"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold">Message</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-md flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
