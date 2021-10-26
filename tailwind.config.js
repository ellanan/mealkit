module.exports = {
  mode: 'jit',
  purge: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        11: '#7e7979',
        12: '#f3f0ed',
        13: '#646161',
        14: '#593e31',
        15: '#5c5656',
        16: '#383636',
        17: '#',
        18: '#',
        19: '#',
        21: '#',
        22: '#',
        23: '#',
        24: '#',
        25: '#',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
