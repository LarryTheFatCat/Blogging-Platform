const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "desktop-background": "url('https://img.freepik.com/free-vector/realistic-white-monochrome-background_23-2149023990.jpg?t=st=1724668974~exp=1724672574~hmac=c15cc8f22177376d2b4a139c7b3523910c4b7c1bdff2119d544e52994afb1172&w=2000')",
        "mobile-background": "url('https://img.freepik.com/free-vector/realistic-white-monochrome-background_23-2149023990.jpg?t=st=1724668974~exp=1724672574~hmac=c15cc8f22177376d2b4a139c7b3523910c4b7c1bdff2119d544e52994afb1172&w=2000')"
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
