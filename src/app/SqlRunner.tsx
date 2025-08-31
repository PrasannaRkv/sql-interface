"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/lib/utils";
import { useQueryState } from "@/utils/useQueryState";
import VirtualizedTable from "../Components/VirtualisedTable";

export default function SqlRunnerPage() {
        //   const [query, setQuery] = useState("SELECT * FROM data;");
        const [results, setResults] = useState([]);
        const [error, setError] = useState<string | null>(null);
        const [query, setQuery] = useState('');

        const { get, set } = useQueryState("q"); // stored in ?q=<base64>
        // const [sql, setSql] = useState("");

        useEffect(() => {
                const initial = get() || "SELECT * FROM data;";
                setQuery(initial);
        }, []);

        const handleChange = (value: string | undefined) => {
                const query = value || "";
                setQuery(query);
                set(query); // updates URL in base64
        };


        // const searchParams = useSearchParams();
        // const router = useRouter();
        // Load initial query from URL

        // const initialQuery = searchParams.get("query") || "SELECT * FROM data LIMIT 5;";
        

        // const updateQuery = (query) => {
        //         set(query);
        //         setQuery(query);
        // }

        // Update URL when query changes
        useEffect(() => {
                // const url = new URL(window.location.href);
                // url.searchParams.set("query", query);
                // router.replace(url.pathname + "?" + url.searchParams.toString());
                console.log(">>>", [get()]);
        }, [query]);

        const runQuery = async (query: string) => {
                if (!query) {
                        return;
                }
                setError(null);
                try {
                        const res = await fetch("/api/query", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ sql: query }),
                        });

                        const data = await res.json();
                        if (data.error) {
                                setError(data.error);
                        } else {
                                setResults(data.rows);
                        }
                } catch (err: any) {
                        setError(err.message);
                }
        };

        const debouncedRunQuery = useMemo(() => debounce(runQuery, 300), [])

        useEffect(() => {
                results.length === 0 ? runQuery(query) : debouncedRunQuery(query);
        }, [query])

        return (
                <div className="p-6 font-sans">
                        <h1 className="text-xl font-bold mb-4">SQL Runner</h1>
                        <div className="border rounded overflow-hidden">
                                <Editor
                                        height="200px"
                                        defaultLanguage="sql"
                                        value={query}
                                        onChange={(value) => handleChange(value || "")}
                                        theme="vs-light"
                                        options={{
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                lineNumbers: "on",
                                        }}
                                />
                        </div>

                        <button
                                onClick={() => runQuery(query)}
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
                        >
                                Run Query
                        </button>

                        {error && <p className="text-red-600 mt-3">Error: {error}</p>}

                        <VirtualizedTable rows={results || []} />

                        {results.length > 0 && (
                                <div className="overflow-x-auto mt-4">
                                        <table className="border-collapse border w-full text-sm">
                                                <thead>
                                                        <tr>
                                                                {Object.keys(results[0]).map((col) => (
                                                                        <th
                                                                                key={col}
                                                                                className="border px-2 py-1 bg-gray-200 text-left"
                                                                        >
                                                                                {col}
                                                                        </th>
                                                                ))}
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {results.map((row, i) => (
                                                                <tr key={i}>
                                                                        {Object.values(row).map((val, j) => (
                                                                                <td key={j} className="border px-2 py-1">
                                                                                        {String(val)}
                                                                                </td>
                                                                        ))}
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                </div>
                        )}
                </div>
        );
}