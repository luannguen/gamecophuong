/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#0df2f2",
                "background-light": "#f5f8f8",
                "background-dark": "#102323",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "body": ["Manrope", "sans-serif"],
            },
            borderRadius: {
                "xl": "0.75rem",
                "2xl": "1rem",
            }
        },
    },
    plugins: [],
}
