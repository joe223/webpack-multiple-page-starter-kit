module.exports = {
    root: true,
    env: {
        node: true
    },
    // 'extends': [
    //     'plugin:vue/essential',
    //     'eslint:recommended',
    // ],
    plugins: [
        "vue"
    ],
    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off"
            }
        }
    ],
    extends: ["plugin:vue/essential", "airbnb-base", 'eslint:recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "indent": ["error", 4],
        "vue/script-indent": [
            "error",
            4,
            {
                baseIndent: 1,
                switchCase: 1
            }
        ],
        "no-plusplus": ["off"],
        "arrow-parens": ["error", "as-needed"],
        "import/prefer-default-export": ["off"],
        "no-else-return": ["off"],
        "semi": ["error", "never"],
        "semi-style": ["error", "first"],
        "quotes": ["error", "single"],
        "comma-dangle": ["error", "never"],
        "space-before-function-paren": ["error", "always"],
        "one-var": ["error", "never"],
        "no-var": "error",
        "spaced-comment": ["error", "always", {
            "line": {
                "markers": ["/"],
                "exceptions": ["-", "+"]
            },
            "block": {
                "markers": ["!"],
                "exceptions": ["*"],
                "balanced": true
            }
        }],
        "max-len": ["error", {
            code: 120
        }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    globals: {
        MPing: 'readonly'
    }
}
