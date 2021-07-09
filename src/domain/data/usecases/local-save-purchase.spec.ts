class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) { }
}

interface CacheStore { }

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
}

describe('LocalSavePurchases', () => {
  test('Garantir que o cache não seja apagado ao iniciar', () => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
})


