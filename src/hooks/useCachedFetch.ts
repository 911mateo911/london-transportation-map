import { useRef, useCallback } from "react";
import { MaxSizeCacheWithInvalidation } from "../utils/MaxSizeCacheWithInvalidation";

interface UseCachedFetchParams {
  cacheSize?: number;
  useAbortController?: boolean;
}

export function useCachedFetch<DataType extends object>({
  cacheSize = 50,
  useAbortController
}: UseCachedFetchParams = {}) {
  const cache = useRef(new MaxSizeCacheWithInvalidation<DataType>(cacheSize));
  const abortController = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (
    fetchUrl: string,
    init?: RequestInit
  ): Promise<DataType | null> => {
    if (abortController.current && useAbortController) {
      abortController.current.abort();
    }

    const cachedData = cache.current.get(fetchUrl);
    if (cachedData) {
      return cachedData;
    }

    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    try {
      const response = await fetch(fetchUrl, {
        ...init,
        signal
      });

      if (!response.ok) {
        return null;
      }

      const data: DataType = await response.json();
      cache.current.set(fetchUrl, data);

      return data;
    } catch (err) {
      return null;
    }
  }, [useAbortController]);

  return [fetchData]
}
