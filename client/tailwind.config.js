/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09201d",
        teal: "#0f3d36",
        forest: "#14584d",
        cream: "#f6f1e7",
        gold: "#d6b56d",
        mist: "#dce8e0"
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 30px 80px rgba(5, 23, 20, 0.28)",
        panel: "0 18px 50px rgba(6, 25, 22, 0.18)"
      },
      opacity: {
        6: "0.06",
        8: "0.08",
        12: "0.12",
        15: "0.15",
        18: "0.18",
        20: "0.20",
        25: "0.25",
        28: "0.28",
        30: "0.30",
        35: "0.35",
        40: "0.40",
        45: "0.45",
        55: "0.55",
        60: "0.60",
        65: "0.65",
        68: "0.68",
        70: "0.70",
        75: "0.75",
        80: "0.80",
        85: "0.85"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(214,181,109,0.22), transparent 30%), radial-gradient(circle at top right, rgba(67,125,110,0.28), transparent 28%), linear-gradient(135deg, #061513 0%, #0d302a 52%, #123d35 100%)"
      }
    }
  },
  plugins: []
};
