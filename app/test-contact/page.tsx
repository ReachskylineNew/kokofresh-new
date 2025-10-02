"use client";
import { useState } from "react";

export default function WixForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_5308: "",
    phone_0187: "",
    leave_us_a_message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/form-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus("✅ Submitted!");
    } else {
      setStatus("❌ Error: " + (result.error || "Something went wrong"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md w-96 space-y-2">
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="email"
        name="email_5308"
        placeholder="Email"
        value={formData.email_5308}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        type="tel"
        name="phone_0187"
        placeholder="Phone"
        value={formData.phone_0187}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <textarea
        name="leave_us_a_message"
        placeholder="Your Message"
        value={formData.leave_us_a_message}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  );
}
