module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest' /* qualquer arquivo que termine com .ts vamos transformar isso usando o ts-jest, isto é, para javascript */
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1' /*Onde tiver @/qualquer_coisa será substituído por <rootDir>/src/qualquer_coisa */
  }
}