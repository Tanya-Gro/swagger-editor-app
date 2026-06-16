/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-order'],
  rules: {
    'import-notation': 'string',
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],

    'order/order': [
      'custom-properties',
      'dollar-variables',
      {
        type: 'at-rule',
        name: 'extend',
      },
      {
        type: 'at-rule',
        name: 'extend',
        hasBlock: true,
      },
      'declarations',
      'rules',
      {
        type: 'at-rule',
        name: 'include',
      },
      {
        type: 'at-rule',
        name: 'include',
        hasBlock: true,
      },
      {
        type: 'at-rule',
      },
      {
        type: 'at-rule',
        hasBlock: true,
      },
    ],
  },
};
