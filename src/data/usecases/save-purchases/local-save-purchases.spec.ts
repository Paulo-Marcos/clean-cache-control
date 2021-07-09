import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchases } from '@/domain'


class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: SavePurchases.Params[] = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() })
  }
}

const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: '1',
    date: new Date(),
    value: 50
  },
  {
    id: '2',
    date: new Date(),
    value: 70
  }
]

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)

  return {
    sut, cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Garantir que o cache não seja apagado ao iniciar', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Garantir que o cache antigo seja deletado', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchase')
  })

  test('Não inserir novo cache se o método delete falhar', () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Deverá inserir o novo cache se o delete der certo', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchase')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

})


