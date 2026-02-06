/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
      },
    },
  },
  plugins: [],
};
