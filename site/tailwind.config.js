import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            borderWidth: {
                '3': '3px',
            },
            gridTemplateColumns: {
                'info': '2fr 5fr',
            },
            minWidth: {
                '4/5': '80%',
            },
            maxWidth: {
                '1200': '1200px',
            },
            backgroundImage: {
                'tt-alternate-h': 'linear-gradient(90deg, var(--tt-alternate) 50%, transparent 0)',
                'tt-alternate-v': 'linear-gradient(360deg, var(--tt-alternate) 50%, transparent 0)'
            },
            backgroundSize: {
                'tt-loop': '16.7% 16.7%',
            },
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    "color-scheme": "light",
                    "primary": "#3b82f6",
                    "secondary": "oklch(69.71% 0.329 342.55)",
                    "secondary-content": "oklch(98.71% 0.0106 342.55)",
                    "accent": "#2563eb",
                    "neutral": "#9ca3af",
                    "neutral-content": "#D7DDE4",
                    "base-100": "oklch(100% 0 0)",
                    "base-200": "#F2F2F2",
                    "base-300": "#E5E6E6",
                    "base-content": "#1f2937",
                    '--tt-alternate': '#dddddd',
                },
                dark: {
                    "color-scheme": "dark",
                    "primary": "#3b82f6",
                    "secondary": "#99f6e4",
                    "accent": "#2563eb",
                    "neutral": "#e5e7eb",
                    "base-100": "#1f2937",
                    "info": "#3b82f6",
                    "success": "#4ade80",
                    "warning": "#fbbf24",
                    "error": "#ef4444",
                    '--tt-alternate': '#1a1e2c',
                }
            }],
    },
    plugins: [
        daisyui,
    ],
}

