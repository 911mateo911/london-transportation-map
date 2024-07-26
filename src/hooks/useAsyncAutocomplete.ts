import { useState, useRef, useCallback, useEffect } from "react";
import { MaxSizeCacheWithInvalidation } from "../utils/MaxSizeCacheWithInvalidation";

export function useAsyncAutocomplete<DataType extends object>(
  fetchUrl: string,
  enabled = true,
  debounceTime = 600
) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const cache = useRef(new MaxSizeCacheWithInvalidation(50));

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
    } finally {
      setLoading(false);
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

    setLoading(true);
    const cachedData = cache.current.get(fetchUrl);
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
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

  return { data, loading };
}
