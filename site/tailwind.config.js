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
                '3/5': '60%',
            },
            maxWidth: {
                '4/5': '80%',
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

