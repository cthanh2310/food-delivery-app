/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/generated/**"],
    coverageDirectory: "coverage",
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
    maxWorkers: 1, // Run tests sequentially to avoid database conflicts
};
