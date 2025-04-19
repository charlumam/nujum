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

  return {
    name: info?.['Nama Universitas'],
    city: info?.['Kab/Kota'], // Add city information
    prodi: prodiList
  };
}).filter(u => u.name && u.prodi.length > 0); // Ensure university has a name and programs

// Calculate the total number of programs across all universities
const totalPrograms = allUnis.reduce((sum, uni) => sum + uni.prodi.length, 0);

// More accurate approximation for Percentile to Z-score (Inverse Normal CDF)
// Based on Abramowitz and Stegun formula 26.2.23
function percentileToZScore(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    if (p === 0.5) return 0;

    // Constants for the approximation
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;

    let t;
    if (p < 0.5) {
        t = Math.sqrt(-2.0 * Math.log(p));
        const numerator = c0 + c1 * t + c2 * t * t;
        const denominator = 1 + d1 * t + d2 * t * t + d3 * t * t * t;
        return -(numerator / denominator);
    } else {
        t = Math.sqrt(-2.0 * Math.log(1.0 - p));
        const numerator = c0 + c1 * t + c2 * t * t;
        const denominator = 1 + d1 * t + d2 * t * t + d3 * t * t * t;
        return numerator / denominator;
    }
}


export default function App() {
  // will hold null before search and array of results after
  const [eligibleUnis, setEligibleUnis] = useState(null);
  const [finalScore, setFinalScore] = useState(null); // Add state for final score
  const [totalEligible, setTotalEligible] = useState(0); // Add state for total eligible count

  const handleScoresSubmit = (scores) => {
    // Calculate user's average score
    const scoreValues = Object.values(scores).map(Number);
    const userAverageScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    setFinalScore(userAverageScore.toFixed(2)); // Set final score state

    // If user's average score is below minimum threshold, return no results
    if (userAverageScore < 178) {
      setEligibleUnis([]);
      setTotalEligible(0); // Reset eligible count
      return;
    }

    console.log('User Average Score:', userAverageScore);

    const filteredUnis = allUnis.map(uni => {
      const eligibleProdi = uni.prodi.map(prodi => { // Use map instead of filter to keep admissionRate
        const seats = prodi.dayaTampung2025;
        const applicants = prodi.peminat2024;

        // Skip if no seats or no applicant data for calculation
        if (seats <= 0 || applicants <= 0) {
          return null; // Mark as ineligible
        }

        const admissionRate = seats / applicants;
        // Ensure rate is not > 1 (can happen with data errors)
        const validAdmissionRate = Math.min(admissionRate, 1.0);

        let meetsCutoff = false;
        // If admission rate is 100%, everyone qualifies (percentile 0)
        if (validAdmissionRate >= 1.0) {
            meetsCutoff = true; // Cutoff is effectively lowest possible score
        } else {
            const requiredPercentile = 1.0 - validAdmissionRate;
            const zScore = percentileToZScore(requiredPercentile);

            // Handle infinite Z-scores (percentile 0 or 1)
            if (!isFinite(zScore)) {
                // If percentile is 1 (Z=Infinity), technically impossible unless score is infinite
                // If percentile is 0 (Z=-Infinity), technically always possible
                meetsCutoff = zScore === -Infinity;
            } else {
                // Calculate UTBK cut-off score using the official 2024 mean (500) and std dev (100)
                const mean = 500;
                const stdDev = 100;
                const cutoffScore = mean + zScore * stdDev;
                meetsCutoff = userAverageScore >= cutoffScore;
            }
        }

        // console.log(`${uni.name} - ${prodi.nama}: Seats=${seats}, Applicants=${applicants}, Rate=${admissionRate.toFixed(4)}, Percentile=${requiredPercentile.toFixed(4)}, Z=${zScore.toFixed(2)}, Cutoff=${cutoffScore.toFixed(2)}`);

        // Return prodi object with admissionRate if it meets the cutoff, otherwise null
        return meetsCutoff ? { ...prodi, admissionRate: validAdmissionRate } : null;
      }).filter(prodi => prodi !== null); // Filter out null (ineligible) programs

      // Return university only if it has eligible programs
      if (eligibleProdi.length > 0) {
        // Ensure city is included in the filtered results
        return { ...uni, prodi: eligibleProdi };
      }
      return null; // Remove university if no programs match
    }).filter(uni => uni !== null); // Filter out null entries

    // Calculate total eligible programs count
    const currentTotalEligible = filteredUnis.reduce((sum, uni) => sum + uni.prodi.length, 0);
    setTotalEligible(currentTotalEligible); // Set total eligible count state

    console.log('Filtered Universities Count:', filteredUnis.length);
    console.log('Total Eligible Programs:', currentTotalEligible); // Log the program count
    setEligibleUnis(filteredUnis);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 xl:max-w-7xl">
      {/* If no results yet, center the ScoreForm */}
      {eligibleUnis === null ? (
        <div className="max-w-xl mx-auto">
          <ScoreForm
            onSubmit={handleScoresSubmit}
            finalScore={finalScore}
            totalEligible={totalEligible}
            totalPrograms={totalPrograms}
          />
        </div>
      ) : (
        /* Show side-by-side layout once results are available */
        <div className="lg:flex lg:space-x-6 lg:space-y-0 space-y-8">
          {/* Left column - ScoreForm */}
          <div className="lg:w-2/5">
            <ScoreForm
              onSubmit={handleScoresSubmit}
              finalScore={finalScore}
              totalEligible={totalEligible}
              totalPrograms={totalPrograms}
            />
          </div>
          
          {/* Right column - Results */}
          <div className="lg:w-3/5">
            <Results universities={eligibleUnis} totalEligible={totalEligible} />
          </div>
        </div>
      )}
    </div>
  );
}