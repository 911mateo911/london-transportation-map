export class MaxSizeCacheWithInvalidation<T extends object> {
  private maxSize: number;
  private cacheMap = new Map<string | undefined, T>();
  private keyOrderList: string[] = [];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: string) {
    return this.cacheMap.get(key);
  }

  set(key: string, value: T) {
    if (this.cacheMap.size >= this.maxSize) {
      const oldestKey = this.keyOrderList.shift();
      this.cacheMap.delete(oldestKey);
    }
    this.cacheMap.set(key, value);
    this.keyOrderList.push(key);
  }
}
