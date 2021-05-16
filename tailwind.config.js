module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false,
  theme: {
    colors: {
      white: '#ffffff',
      black: '#000',

      'blue-1': '#03449e',
      'blue-2': '#01337d',

      'neutral-1': '#1f2933',
      'neutral-2': '#3e4c59',
      'neutral-3': '#e4e7eb',
      'neutral-4': '#f5f7fa',

      'supporting-1': '#05606e',
      'supporting-2': '#f7c948',
      'supporting-3': '#ad1d07'
    },
    fontFamily: {
      sans: 'Avenir, Arial, Helvetica, sans-serif'
    },
    extend: {
      zIndex: {
        '-1': '-1'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
