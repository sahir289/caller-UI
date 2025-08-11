import { useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const [file, setFile] = useState(null);
  const [companyType, setCompanyType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !companyType) {
      alert("Please select a file and company type");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyType", companyType);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select Company Type</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}
"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [companyType, setCompanyType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !companyType) {
      alert("Please select a file and company type");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyType", companyType);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Company Type</label>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select --</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
