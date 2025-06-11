import React, { useState } from "react";
import axios from "axios";

const ResumeForm = ({ onResult }) => {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumes.length || !jobDescription) {
      alert("Resume(s) and job description required.");
      return;
    }

    const formData = new FormData();
    Array.from(resumes).forEach(f => formData.append("resumes", f));
    formData.append("job_description", jobDescription);

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData);
      onResult(res.data.results);
    } catch (err) {
      alert("Error: " + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl p-6 bg-white rounded-md shadow-md">
      <div className="mb-4">
        <label className="block mb-2">Job Description:</label>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows="4"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">PDF Resume(s):</label>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={e => setResumes(e.target.files)}
          className="block w-full p-2 border rounded"
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Analyze
      </button>
    </form>
  );
};

export default ResumeForm;
