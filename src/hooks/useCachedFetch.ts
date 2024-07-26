import { useRef, useState, useCallback } from "react";
import { MaxSizeCacheWithInvalidation } from "../utils/MaxSizeCacheWithInvalidation";

export function useCachedFetch<DataType extends object>() {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cache = useRef(new MaxSizeCacheWithInvalidation<DataType>(50));
  const abortController = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (fetchUrl: string, init?: RequestInit): Promise<void> => {
    if (abortController.current) {
      abortController.current.abort();
    }

    const cachedData = cache.current.get(fetchUrl);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    setIsLoading(true);
    try {
      const response = await fetch(fetchUrl, {
        ...init,
        signal
      });

      if (!response.ok) {
        return;
      }

      const data: DataType = await response.json();
      cache.current.set(fetchUrl, data);

      setData(data);
    } catch (err) {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
  }, []);

  return {
    data,
    isLoading,
    fetchData,
    reset
  };
}
