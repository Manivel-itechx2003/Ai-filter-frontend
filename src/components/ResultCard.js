import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ResultCard = ({ result }) => {
  const score = result.match_score;
  const data = {
    labels: ["Match", "Gap"],
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: ["#4ade80", "#f87171"],
      borderWidth: 1,
    }]
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-green-700">{result.filename}</h2>
      <p className="mt-2 mb-4">Match: <strong>{score}%</strong></p>
      <Pie data={data} />
    </div>
  );
};

export default ResultCard;
