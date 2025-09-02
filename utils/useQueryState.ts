"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/* 
Encoders: this encoding techniques can be improved. for now chosing simple base64 encoding
*/
const encodeBase64 = (q: string) => (q ? btoa(q) : "");
const decodeBase64 = (q: string | null) => {
        if (!q) return "";
        try {
                return atob(q);
        } catch {
                return ""; // fallback if invalid base64
        }
};

export function useQueryState(key: string, defaultValue: string) {

        const router = useRouter();
        const searchParams = useSearchParams();
        const [query, _setQuery] = useState('');

        useEffect(() => {
                const initial = decodeBase64(searchParams.get(key)) || defaultValue;
                _setQuery(initial);
        }, [key]);

        const setQuery = useCallback((value: string) => {
                _setQuery(value);
                const url = new URL(window.location.href);
                const params = url.searchParams;
                if (value) {
                        params.set(key, encodeBase64(value));
                } else {
                        params.delete(key);
                }
                router.replace(url.pathname + "?" + url.searchParams.toString());
        }, [key]);

        return { setQuery, query };
}