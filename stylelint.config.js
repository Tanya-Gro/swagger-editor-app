const stylelintConfig = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['.next/**', 'build/**', 'coverage/**', 'dist/**', 'node_modules/**', 'out/**'],
  rules: {
    'alpha-value-notation': 'percentage',
    'color-function-notation': 'modern',
    'color-hex-length': 'long',
    'custom-property-empty-line-before': undefined,
    'declaration-empty-line-before': undefined,
    'font-family-name-quotes': 'always-where-recommended',
    'function-url-quotes': 'always',
    'import-notation': 'string',
    'media-feature-range-notation': 'context',
    'selector-class-pattern': [
      '^[a-z][a-z0-9-]*$',
      {
        message: 'Expected class selector to be kebab-case',
      },
    ],
  },
};

export default stylelintConfig;
