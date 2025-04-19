import React, { useState } from 'react';
import ScoreForm from './ScoreForm.jsx';
import Results from './Results.jsx';

// load all JSON data under data/ptn on component initialization using Vite glob with eager option
const modules = import.meta.glob('../data/ptn/**/*.json', { eager: true, as: 'json' });
const allData = Object.values(modules);

// Helper function to safely access nested properties
const safeGet = (obj, path, defaultValue = 0) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
};

// Preprocess university data to include necessary fields
const allUnis = allData.map(data => {
  const info = data.informasi_universitas;
  const prodiList = (data.daftar_prodi || []).map(p => {
    const sebaranData = p['SEBARAN DATA'] || {};
    const dayaTampung = sebaranData['Daya Tampung'] || {};
    const jumlahPeminat = sebaranData['Jumlah Peminat'] || {};

    return {
      nama: p.NAMA,
      dayaTampung2025: Number(dayaTampung['2025']) || 0, // Use 2025 data
      peminat2024: Number(jumlahPeminat['2024']) || 0, // Use 2024 data (last year)
    };
  }).filter(p => p.nama); // Ensure program has a name

  return { name: info?.['Nama Universitas'], prodi: prodiList };
}).filter(u => u.name && u.prodi.length > 0); // Ensure university has a name and programs

// Placeholder for percentile to Z-score conversion.
// A proper implementation using numerical methods (e.g., Acklam's algorithm) is recommended for accuracy.
// This lookup table provides a rough approximation.
function percentileToZScore(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  // Rough lookup based on common values
  const lookup = [
    [0.01, -2.326], [0.025, -1.960], [0.05, -1.645], [0.10, -1.282],
    [0.20, -0.842], [0.30, -0.524], [0.40, -0.253], [0.50, 0.000],
    [0.60, 0.253], [0.70, 0.524], [0.80, 0.842], [0.90, 1.282],
    [0.95, 1.645], [0.975, 1.960], [0.99, 2.326],
  ];

  // Find the two closest points for interpolation (simple linear)
  let lower = lookup[0];
  let upper = lookup[lookup.length - 1];

  for (let i = 0; i < lookup.length; i++) {
    if (lookup[i][0] <= p) {
      lower = lookup[i];
    }
    if (lookup[i][0] >= p && upper[0] >= lookup[i][0]) {
      upper = lookup[i];
    }
  }

  if (lower[0] === upper[0]) return lower[1]; // Exact match

  // Linear interpolation
  const fraction = (p - lower[0]) / (upper[0] - lower[0]);
  return lower[1] + fraction * (upper[1] - lower[1]);
}


export default function App() {
  // will hold null before search and array of results after
  const [eligibleUnis, setEligibleUnis] = useState(null);

  const handleScoresSubmit = (scores) => {
    // Calculate user's average score
    const scoreValues = Object.values(scores).map(Number);
    const userAverageScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;

    // If user's average score is below minimum threshold, return no results
    if (userAverageScore < 178) {
      setEligibleUnis([]);
      return;
    }

    console.log('User Average Score:', userAverageScore);

    const filteredUnis = allUnis.map(uni => {
      const eligibleProdi = uni.prodi.filter(prodi => {
        const seats = prodi.dayaTampung2025;
        const applicants = prodi.peminat2024;

        // Skip if no seats or no applicant data for calculation
        if (seats <= 0 || applicants <= 0) {
          return false;
        }

        const admissionRate = seats / applicants;
        // Ensure rate is not > 1 (can happen with data errors)
        const validAdmissionRate = Math.min(admissionRate, 1.0);

        // If admission rate is 100%, everyone qualifies (percentile 0)
        if (validAdmissionRate >= 1.0) {
            return true; // Cutoff is effectively lowest possible score
        }

        const requiredPercentile = 1.0 - validAdmissionRate;
        const zScore = percentileToZScore(requiredPercentile);

        // Handle infinite Z-scores (percentile 0 or 1)
        if (!isFinite(zScore)) {
            // If percentile is 1 (Z=Infinity), technically impossible unless score is infinite
            // If percentile is 0 (Z=-Infinity), technically always possible
            return zScore === -Infinity;
        }

        // Calculate UTBK cut-off score
        const cutoffScore = 500 + zScore * 100;

        // console.log(`${uni.name} - ${prodi.nama}: Seats=${seats}, Applicants=${applicants}, Rate=${admissionRate.toFixed(4)}, Percentile=${requiredPercentile.toFixed(4)}, Z=${zScore.toFixed(2)}, Cutoff=${cutoffScore.toFixed(2)}`);

        return userAverageScore >= cutoffScore;
      });

      // Return university only if it has eligible programs
      if (eligibleProdi.length > 0) {
        return { ...uni, prodi: eligibleProdi };
      }
      return null; // Remove university if no programs match
    }).filter(uni => uni !== null); // Filter out null entries

    console.log('Filtered Universities Count:', filteredUnis.length);
    setEligibleUnis(filteredUnis);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <ScoreForm onSubmit={handleScoresSubmit} />
      {/* Ensure Results component receives the potentially empty or null list correctly */}
      {eligibleUnis !== null && <Results universities={eligibleUnis} />}
    </div>
  );
}