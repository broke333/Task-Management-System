module.exports = {
  content: ["./index.html",   // Your main HTML file
    "./tasks.html",   // Your secondary HTML file
    "./*.js",         // JavaScript files in the root folder
     ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "w-full", "border-collapse", "border", "border-gray-300", "bg-white", "bg-gray-200",
    "px-4", "py-2", "text-left", "rounded-md", "mr-2", "text-white", "bg-blue-500", "bg-red-500"
  ],
};
