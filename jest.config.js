module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
    SpreadsheetApp: {},
  },
  moduleDirectories: [
    'node_modules',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};