import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'


class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key): void {
    this.insertCallsCount++
    this.insertKey = key
  }
}

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
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchase')
  })

  test('Não inserir novo cache se o método delete falhar', () => {
    const { cacheStore, sut } = makeSut()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Deverá inserir o novo cache se o delete der certo', async () => {
    const { cacheStore, sut } = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchase')
  })

})


