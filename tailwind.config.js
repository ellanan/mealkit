module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        11: "#7e7979",
        12: "#f3f0ed",
        13: "#646161",
        14: "#593e31",
        15: "#5c5656",
        16: "#383636",
        17: "#ebb59c",
        18: "#ffd8ca",
        19: "#333",
        21: "#e7a47a",
        22: "#e7a47ac6",
        23: "#ff9967eb",
        24: "#fff2ec",
        25: "#1b0b03",
        26: "#f7c481",
        27: "#f5f7f9",
        28: "#ffba99cf",
        29: "#f9f2ec",
      },
      boxShadow: {
        none: "none",
        addRecipeToMealPlanFormSearchbox:
          "0 0 4px 1px rgba(235, 181, 156, 0.3)",
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Raleway: ["Raleway", "sans-serif"],
        Vollkorn: ["Vollkorn", "serif"],
      },
      borderWidth: {
        1: "1px",
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
