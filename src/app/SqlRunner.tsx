"use client";
import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { debounce } from "@/lib/utils";
import { useQueryState } from "@/utils/useQueryState";
import VirtualizedTable from "../Components/VirtualisedTable";

export default function SqlRunnerPage() {
        const [results, setResults] = useState([]);
        const [error, setError] = useState<string | null>(null);

        const { query, setQuery } = useQueryState("q", "SELECT * FROM data;"); // stored in ?q=<base64>

        const handleChange = (value: string | undefined) => {
                const query = value || "";
                setQuery(query);
        };

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
                <div className="px-8 py-4 h-screen flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                                <h1 className="text-xl font-bold">SQL Runner</h1>
                                <div className="border rounded overflow-hidden">
                                        <Editor
                                                height="200px"
                                                defaultLanguage="sql"
                                                value={query}
                                                onChange={(value) => handleChange(value || "")}
                                                theme="vs-dark"
                                                options={{
                                                        minimap: { enabled: false },
                                                        fontSize: 14,
                                                        lineNumbers: "on",
                                                }}
                                        />
                                </div>
                                <div>
                                        <button
                                                onClick={() => runQuery(query)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                        >
                                                Run Query
                                        </button>
                                </div>
                        </div>
                        <div className="flex-1 border rounded overflow-hidden">
                                {error ?
                                        <div className="w-full h-full flex items-center justify-center flex-col gap-1">
                                                <div className="text-2xl">Syntax Error in your SQL Query</div>
                                                <div className="text-lg ">{error}</div>
                                        </div>
                                        :
                                        <VirtualizedTable rows={results || []} />}
                        </div>
                </div>
        );
}