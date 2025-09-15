/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
            boxShadow: {
                card: "0 1px 2px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.10)",
            },
        },
    },
    plugins: [],
};
