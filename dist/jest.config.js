const config = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '<rootDir>/src/**/*.js',
        '!<rootDir>/src/**/*.d.ts'
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['text', 'html', 'cobertura'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^lodash-es$': 'lodash'
    },
    testEnvironment: 'node',
    transform: {
        '\\.[jt]s?$': 'babel-jest'
    }
};
export default config;
