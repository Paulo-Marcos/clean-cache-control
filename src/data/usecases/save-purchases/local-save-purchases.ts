import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain";

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) { }

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.delete('purchase')
    this.cacheStore.insert('purchase', purchases)
  }
}