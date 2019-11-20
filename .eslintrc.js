// https://eslint.org/docs/user-guide/configuring
const baseRules = require('./config/eslint-rules')

module.exports = {
    root: true,
    parserOptions: {
        parser: "babel-eslint"
    },
    env: {
        browser: true,
        node: true
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ["plugin:vue/essential", "airbnb-base"],
    // required to lint *.vue files
    plugins: [
        "vue"
    ],
    // check if imports actually resolve
    settings: {
        "import/resolver": {
            webpack: {
                config: "build/webpack.base.conf.js"
            }
        }
    },
    // add your custom rules here
    rules: {
        ...baseRules,
        // don"t require .vue extension when importing
        "import/extensions": ["error", "always", {
            js: "never",
            vue: "never",
            jsx: "never"
        }],
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        "no-param-reassign": ["off"],
        "consistent-return": ["off"],
        // allow optionalDependencies
        "import/no-extraneous-dependencies": ["error", {
            optionalDependencies: ["test/unit/index.js"]
        }],
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        // custom
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
        "no-tabs": 0,
        "no-new": 0,
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
        }],
        "no-underscore-dangle": ["off"],
        "no-console": ["off"],
        "no-mixed-operators": ["off"],
        "global-require": ["off"],
        "func-names": ["off"]
    },
    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off"
            }
        },
        {
            "files": ["*.js"],
            "rules": {
                "vue/script-indent": "off"
            }
        }
    ],
    globals: {
        MPing: 'readonly'
    }
}
