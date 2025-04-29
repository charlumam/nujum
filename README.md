<div align="center">
<img src="public/favicon.svg" alt="Logo for Nujum that i've created." width="200">
</div>
<br>
<div align="center">

# Nujum

</div>

> "Basically the only (and best) way to check UTBK-SNBT passing grades & acceptance rates."

Nujum is a web application that helps Indonesian students check UTBK-SNBT passing grades and acceptance rates for all public universities in Indonesia. It provides a fast, ad-free, and data-driven way to estimate your chances of acceptance based on your UTBK scores.

## Features

- Covers 145+ PTN and thousands of study programs using official SNPMB data.
- Instantly see estimated passing grades and acceptance rates for each program.
- Filter results by university, city, program name, degree level, and university type (akademik, KIN, vokasi).
- Works on both desktop and mobile.
- 100% free and open-source.

## How It Works

1. The user enter their UTBK-SNBT scores for each tested component.
2. Nujum calculates their average score and compares it to the estimated cutoff for each program.
3. Passing grades are estimated using a normal distribution model:
   - National mean (μ) = 500, standard deviation (σ) = 100 (based on official UTBK data)
   - For each program, the acceptance rate is calculated from the ratio of seats to applicants.
   - The cutoff score is computed as: `cutoff = μ + z × σ`, where z is the z-score for the program's acceptance rate.
4. Users see which programs they are likely to pass, along with their passing grades and acceptance rates.

## Data Sourcing

- All data is scraped from the official SNPMB [website](https://archive.is/JjeQJ) for UTBK-SNBT 2025.
- Data extraction uses HTTrack and Python (BeautifulSoup), then converted to JSON.
- Only programs with available seat and applicant data are included (new programs are excluded).

## Getting Started

```bash
# Clone the repository
git clone https://github.com/charlumam/nujum.git
cd nujum

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Tech Stack

- [Astro](https://astro.build/) (frontend framework)
- [React](https://react.dev/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/) (styling)
