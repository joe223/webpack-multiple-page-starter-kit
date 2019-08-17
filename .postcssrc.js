// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    plugins: [
        require('postcss-import')({
            plugins: [
                require('stylelint')({})
            ]
        }),
        require('postcss-nested'),
        require('saladcss-bem')({
            defaultNamespace: 't',
            style: 'suit',
            separators: {
                descendent: '__',
                modifier: '--'
            },
            shortcuts: {
                utility: 'u',
                component: 'c',
                descendent: 'd',
                modifier: 'm',
                state: 's'
            }
        }),
        require('postcss-preset-env')({
            state: 3,
            features: {
                'nesting-rules': true,
                'custom-properties': true
            }
        }),
        require('postcss-reporter')({
            clearReportedMessages: true
        })
    ]
}
