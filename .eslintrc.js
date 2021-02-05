module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'no-console': 'off',
  },
  globals: {
    page: true,
  },
};
