module.exports = {
    content: ["./src/**/*.{html,js,svelte}"],
    theme: {
        fontFamily: {
            'opensans': ['"Open Sans"', 'sans-serif']
        },
        colors: {
            'trello': '#036BA7',
            'jira': '#0252CC',
            'github': 'black',
            'gitlab': '#D64126'
        },
        extend: {},
    },
    plugins: [require('daisyui')],
}