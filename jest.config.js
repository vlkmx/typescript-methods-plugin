module.exports = {
  globals: {
    "ts-jest": {
      useBabelrc: true,
      tsConfigFile: "./tsconfig.json",
    },
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: ".*\\.spec\\.tsx?$",
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
  moduleDirectories: [".", "src", "node_modules"],
  moduleNameMapper: {
    //
    // WARNING: ORDER MATTERS
    //
    "src/(.*)": "<rootDir>/src/$1",
    src: "<rootDir>/src",
  },
}
