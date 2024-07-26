import { useState, useRef, useCallback, useEffect } from "react";
import { MaxSizeCacheWithInvalidation } from "../utils/MaxSizeCacheWithInvalidation";

export function useAsyncAutocomplete<DataType extends object>(
  fetchUrl: string,
  enabled = true,
  debounceTime = 600
) {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const cache = useRef(new MaxSizeCacheWithInvalidation<DataType>(50));

  const fetchDataWithTimeout = useCallback(async () => {
    try {
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      cache.current.set(fetchUrl, data);

      setData(data);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUrl]);

  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (!enabled || !fetchUrl) {
      setData(null);
      return;
    }

    setIsLoading(true);
    const cachedData = cache.current.get(fetchUrl);
    if (cachedData) {
      setData(cachedData);
      setIsLoading(false);
      return;
    }

    timeoutIdRef.current = setTimeout(() => {
      fetchDataWithTimeout();
    }, debounceTime)

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [debounceTime, enabled, fetchDataWithTimeout, fetchUrl]);

  return { data, isLoading };
}
