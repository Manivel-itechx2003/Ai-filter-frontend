import React, { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setResumes(e.target.files);
  };

  const handleAnalyze = async () => {
    if (!resumes.length || !jobDescription) {
      alert('Please upload resumes and enter a job description.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < resumes.length; i++) {
      formData.append('resumes', resumes[i]);
    }
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('${process.env.REACT_APP_API_URL}', formData);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #020024, #090979, #000c3f)',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      padding: '30px 15px'
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3fa9f5', fontWeight: 'bold', textAlign: 'center' }}>Smart Resume Analyzer</h1>
        <p style={{ textAlign: 'center' }}>Upload resume(s) & job description to get match scores</p>

        <textarea
          placeholder="Enter job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="6"
          style={{
            width: '100%',
            backgroundColor: '#fff',
            color: '#000',
            border: '2px solid #3fa9f5',
            borderRadius: '8px',
            padding: '10px'
          }}
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            color: '#000',
            padding: '10px',
            borderRadius: '6px',
            border: 'none'
          }}
        />

        {resumes.length > 0 && (
          <div style={{ width: '100%' }}>
            <strong>Selected Files:</strong>
            <ul>
              {Array.from(resumes).map((file, index) => (
                <li key={index}>• {file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          style={{
            width: '100%',
            backgroundColor: '#1565c0',
            color: '#fff',
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Analyze
        </button>

        {results.length > 0 && (
          <div style={{
            width: '100%',
            marginTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px'
          }}>
            {results.map((result, index) => {
              const match = parseFloat(result.match_score);
              const pieData = {
                labels: ['Match', 'Mismatch'],
                datasets: [{
                  data: [match, 100 - match],
                  backgroundColor: ['#42f587', '#ff4d4d'],
                  borderWidth: 1
                }]
              };

              const options = {
                responsive: true,
                plugins: {
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.parsed.toFixed(2)}%`;
                      }
                    }
                  },
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#fff'
                    }
                  }
                },
                animation: {
                  animateRotate: true,
                  animateScale: true
                }
              };

              return (
                <div key={index} style={{
                  width: '300px',
                  padding: '10px',
                  border: '1px solid #3fa9f5',
                  borderRadius: '8px',
                  backgroundColor: '#111c44',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    {result.filename}: {match.toFixed(2)}% match
                  </p>
                  <Pie data={pieData} options={options} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
