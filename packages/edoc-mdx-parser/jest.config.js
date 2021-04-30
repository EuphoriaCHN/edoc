module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // If you defined paths in tsconfig.json
    // you have to define them again here
    // for jest doesn't respect tsconfig.json's paths
    '@lib/(.*)': '<rootDir>/src/$1'
  }
};
