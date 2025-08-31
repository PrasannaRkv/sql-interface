"use client";

import { useRouter, useSearchParams } from "next/navigation";

// utils
const encodeBase64 = (q: string) => (q ? btoa(q) : "");
const decodeBase64 = (q: string | null) => {
        if (!q) return "";
        try {
                return atob(q);
        } catch {
                return ""; // fallback if invalid base64
        }
};

export function useQueryState(key: string) {
        const router = useRouter();
        const searchParams = useSearchParams();

        const get = (): string => decodeBase64(searchParams.get(key));

        const set = (value: string) => {
                const url = new URL(window.location.href);
                const params = url.searchParams;
                if (value) {
                        params.set(key, encodeBase64(value));
                } else {
                        params.delete(key);
                }
                // router.replace(`?${params.toString()}`);

                // url.searchParams.set("query", query);
                router.replace(url.pathname + "?" + url.searchParams.toString());
        };

        return { get, set };
}