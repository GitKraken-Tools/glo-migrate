module.exports = {
    content: ["./src/**/*.{html,js,svelte}"],
    theme: {
        fontFamily: {
            'opensans': ['"Open Sans"', 'sans-serif']
        },
        extend: {},
    },
    plugins: [require('daisyui')],
}