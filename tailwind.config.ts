import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-arabic)", "sans-serif"],
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        brand: {
          teal: "#0099A8",
          blue: "#005F9E",
          gold: "#F5A623",
          pink: "#E91E8C",
          dark: "#1A2B3C",
          text: "#1A2B3C",
          muted: "#42526b",
          50: "#F0F4F5",
          100: "#D8EEF1",
          200: "#B8E1E6",
          300: "#86CCD5",
          400: "#4EB4C0",
          500: "#0099A8",
          600: "#007E8B",
          700: "#00656F",
          800: "#005F9E",
          900: "#0A3554"
        }
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      backgroundImage: {
        "brand-gradient": "linear-gradient(175deg, #0099A8 15%, #005F9E 68%)",
        "button-gradient": "linear-gradient(82deg, #F5A623 0%, #E91E8C 100%)",
        "button-blur": "linear-gradient(80deg, rgba(245,166,35,0.7) 0%, rgba(233,30,140,0.7) 100%)",
        "text-gradient": "linear-gradient(257deg, #005F9E 0%, #0099A8 75%)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
