"use client";

import { usePathname, useSearchParams } from "next/navigation";
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
        const pathname = usePathname();
        const searchParams = useSearchParams();
        const getFromUrl = () =>
                decodeBase64(searchParams.get(key)) || defaultValue;

        const [query, setLocalQuery] = useState(getFromUrl);

        useEffect(() => {
                setLocalQuery(getFromUrl());
        }, [searchParams, key]);

        const setQuery = useCallback(
                (value: string) => {
                        setLocalQuery(value);
                        const params = new URLSearchParams(searchParams.toString());
                        if (value) {
                                params.set(key, encodeBase64(value));
                        } else {
                                params.delete(key);
                        }
                        const newUrl = `${pathname}?${params.toString()}`;
                        window.history.pushState({}, "", newUrl);
                },
                [key, pathname, searchParams]
        );

        return { query, setQuery };
}