import React, { useState } from 'react';
import ScoreForm from './ScoreForm.jsx';
import Results from './Results.jsx';

// Lazy load JSON modules only when user searches
const modules = import.meta.glob('../data/ptn/**/*.json', { as: 'json' });

// Helper function to safely access nested properties

// Note: JSON data will be dynamically loaded and preprocessed in handleScoresSubmit

// Constants and functions for new UTBK cut-off algorithm
const MEAN = 500;        // national mean per sub-test
const STD  = 100;        // national standard deviation

function invNorm(p) {
  if (p <= 0 || p >= 1) throw RangeError("p must be in (0,1)");
  const a1 = -3.969683028665376e+01, a2 = 2.209460984245205e+02, a3 = -2.759285104469687e+02,
        a4 = 1.383577518672690e+02, a5 = -3.066479806614716e+01, a6 = 2.506628277459239e+00;
  const b1 = -5.447609879822406e+01, b2 = 1.615858368580409e+02, b3 = -1.556989798598866e+02,
        b4 = 6.680131188771972e+01, b5 = -1.328068155288572e+01;
  const c1 = -7.784894002430293e-03, c2 = -3.223964580411365e-01, c3 = -2.400758277161838e+00,
        c4 = -2.549732539343734e+00, c5 = 4.374664141464968e+00,  c6 = 2.938163982698783e+00;
  const d1 = 7.784695709041462e-03,  d2 = 3.224671290700398e-01,  d3 = 2.445134137142996e+00,
        d4 = 3.754408661907416e+00;
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1*q + c2)*q + c3)*q + c4)*q + c5)*q + c6) /
           ((((d1*q + d2)*q + d3)*q + d4)*q + 1);
  }
  if (p > pHigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1*q + c2)*q + c3)*q + c4)*q + c5)*q + c6) /
             ((((d1*q + d2)*q + d3)*q + d4)*q + 1);
  }
  q = p - 0.5;
  r = q * q;
  return (((((a1*r + a2)*r + a3)*r + a4)*r + a5)*r + a6) * q /
         (((((b1*r + b2)*r + b3)*r + b4)*r + b5)*r + 1);
}

function getRequiredAverage(mean, sigma, accRate) {
  const p = 1 - accRate;
  const z = invNorm(p);
  const required = mean + z * sigma;
  return { p, z, required };
}

export default function App() {
  // will hold null before search and array of results after
  const [eligibleUnis, setEligibleUnis] = useState(null);
  const [finalScore, setFinalScore] = useState(null); // Add state for final score
  const [totalEligible, setTotalEligible] = useState(0); // Add state for total eligible count
  const [inputScores, setInputScores] = useState(null); // Add state to preserve user input scores
  const [totalPrograms, setTotalPrograms] = useState(0); // Track total programs count after load

  const handleScoresSubmit = async (scores) => {
    // Save the input scores
    setInputScores(scores);
    
    // Lazy-load all JSON and preprocess university data
    const modulesData = await Promise.all(
      Object.values(modules).map(loader => loader())
    );
    const allUnis = modulesData.map(data => {
      const info = data.informasi_universitas;
      const prodiList = (data.daftar_prodi || []).map(p => {
        const sebaranData = p['SEBARAN DATA'] || {};
        const dayaTampung = sebaranData['Daya Tampung'] || {};
        const jumlahPeminat = sebaranData['Jumlah Peminat'] || {};
        return {
          nama: p.NAMA,
          dayaTampung2025: Number(dayaTampung['2025']) || 0,
          peminat2024: Number(jumlahPeminat['2024']) || 0,
        };
      }).filter(p => p.nama);
      return {
        name: info?.['Nama Universitas'],
        city: info?.['Kab/Kota'],
        prodi: prodiList
      };
    }).filter(u => u.name && u.prodi.length > 0);
    // Compute total programs
    setTotalPrograms(allUnis.reduce((sum, uni) => sum + uni.prodi.length, 0));

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

    // Filter programs based on cutoff
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
        let cutoffScore = 0;  // initialize cutoff score

        if (validAdmissionRate >= 1.0) {
          meetsCutoff = true;
          cutoffScore = 0; // everyone qualifies
        } else {
          const { required } = getRequiredAverage(MEAN, STD, validAdmissionRate);
          cutoffScore = required;
          meetsCutoff = userAverageScore >= cutoffScore;
        }

        // Return prodi object with admissionRate if it meets the cutoff, otherwise null
        return meetsCutoff
          ? { ...prodi, admissionRate: validAdmissionRate, cutoffScore: Number(cutoffScore.toFixed(2)) }
          : null;
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
    <div className="container mx-auto p-2 sm:p-3 md:p-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      {/* If no results yet, center the ScoreForm */}
      {eligibleUnis === null ? (
        <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <ScoreForm
            onSubmit={handleScoresSubmit}
            finalScore={finalScore}
            totalEligible={totalEligible}
            totalPrograms={totalPrograms}
            savedScores={inputScores}
          />
        </div>
      ) : (
        /* Show side-by-side layout once results are available */
        <div className="flex flex-col md:flex-row md:space-x-4 lg:space-x-6 space-y-6 md:space-y-0">
          {/* Left column - ScoreForm */}
          <div className="w-full md:w-5/12 lg:w-2/5">
            <ScoreForm
              onSubmit={handleScoresSubmit}
              finalScore={finalScore}
              totalEligible={totalEligible}
              totalPrograms={totalPrograms}
              savedScores={inputScores}
            />
          </div>
          
          {/* Right column - Results */}
          <div className="w-full md:w-7/12 lg:w-3/5">
            <Results universities={eligibleUnis} totalEligible={totalEligible} />
          </div>
        </div>
      )}
    </div>
  );
}