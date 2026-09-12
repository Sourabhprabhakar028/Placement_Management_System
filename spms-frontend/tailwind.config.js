/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#04080F',
          1: '#070D1A',
          2: '#0A1220',
          3: '#0D1628',
          4: '#111E34',
          5: '#16263E',
        },
        blue: {
          DEFAULT: '#3D7EFF',
          h: '#5591FF',
          soft: 'rgba(61,126,255,0.10)',
          glow: 'rgba(61,126,255,0.18)',
        },
        accent: {
          green:  '#19C97A',
          amber:  '#F5A623',
          rose:   '#FF4D6D',
          violet: '#8B5CF6',
          teal:   '#0CC8B8',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          2: 'rgba(255,255,255,0.09)',
          3: 'rgba(255,255,255,0.15)',
        },
        t: {
          1: '#E8EDF5',
          2: '#8B9BB4',
          3: '#4A5568',
          4: '#2D3A4E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
