"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchOptions<TBody = any> {
  method?: "GET" | "POST";
  body?: TBody;
  headers?: HeadersInit;
  skip?: boolean;
}

export function useFetch<TResponse = any, TBody = any>(
  url: string,
  { method = "GET", body, headers, skip = true }: UseFetchOptions<TBody> = {}
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (overrideBody?: TBody) => {
      if (!url) return;

      // cancel any pending request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: method === "POST" ? JSON.stringify(overrideBody ?? body) : undefined,
          signal: controller.signal,
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Request failed");
        }
        setData(json);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, method, body, headers]
  );

  useEffect(() => {
    if (!skip) run();
    return () => controllerRef.current?.abort();
  }, [skip, run]);

  return { data, error, loading, run };
}