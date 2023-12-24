import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            gridTemplateColumns: {
                'info': '2fr 5fr',
            },
            minWidth: {
                '4/5': '80%',
            },
            maxWidth: {
                '1200': '1200px',
            }
        },
    },
    daisyui: {
        themes: ["light", "dark"]
    },
    plugins: [
        daisyui,
    ],
}

