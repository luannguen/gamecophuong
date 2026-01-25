
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#00d1d1",
                "sidebar-active": "#e0fcfc",
                "background-light": "#f8fafc",
                "card-light": "#ffffff",
            },
            fontFamily: {
                display: ["Outfit", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
                "xl": "1.5rem",
                "2xl": "2.5rem",
            },
        },
    },
    plugins: [],
}
