module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error', // Ensures Prettier rules are enforced
    '@typescript-eslint/no-explicit-any': 'warn', // SonarQube prefers avoiding 'any'
    '@typescript-eslint/explicit-function-return-type': 'off', // Prevent unnecessary noise
  },
};
