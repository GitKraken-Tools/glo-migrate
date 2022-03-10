module.exports = {
    content: ["./src/**/*.{html,js,svelte}"],
    theme: {
        fontFamily: {
            'opensans': ['"Open Sans"', 'sans-serif']
        },
        extend: {
            colors: {
                'trello': '#036BA7',
                'jira': '#0252CC',
                'gitlab': '#D64126',
                'background': '#1B2125',
                'foreground': '#20313F',
                'accent': '#2D3E51',
                'primary': '#20C0C0'
            }
        },
    },
    plugins: [],
}