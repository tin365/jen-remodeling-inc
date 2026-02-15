/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1ea',
        ink: '#1a1a1a',
        'ink-light': '#333333',
        rule: '#1a1a1a',
        'rule-light': '#999999',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        content: '720px',
      },
    },
  },
  plugins: [],
}
