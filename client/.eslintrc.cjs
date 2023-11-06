module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': ['error', { ignore: ['popover-top', 'popover-bottom'] }],
    // TODO
    'jsx-a11y/control-has-associated-label': 0,
    'jsx-a11y/label-has-associated-control': 0,
  },
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
};
