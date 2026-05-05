import type { Config } from "tailwindcss";

const config = {
  darkMode: "class", // Enable dark mode with a class
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "", // Add a prefix to avoid conflicts (optional)
  theme: {
    container: {
      center: true,
      padding: "2rem", // Default padding for containers
      screens: {
        "2xl": "1400px", // Custom breakpoint for extra large screens
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'], // Custom font
      },
      screens: {
        xs: "380px", // Extra small screens
        slg: "840px", // Small large screens
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(0 0% 100%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to: { backgroundPosition: "200% center" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "score-fill": {
          from: { width: "0%" },
          to: { width: "var(--score-width)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 16px -4px hsl(var(--primary) / 0.35)" },
          "50%": { boxShadow: "0 0 28px -2px hsl(var(--primary) / 0.62)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.35s ease-out both",
        "fade-in": "fade-in 0.25s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out both",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "float-y": "float-y 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
        gradient: "gradient 4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Ensure the plugin is installed
} satisfies Config;

export default config;
