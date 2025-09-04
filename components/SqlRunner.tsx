"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { debounce } from "@/lib/utils";
import { useQueryState } from "@/utils/useQueryState";
import VirtualizedTable from "@/components/VirtualizedTable";
import { Button } from "@/components/ui/button";
import ChatPane from "@/components/ChatPane";
import SavedQueries from "./SavedQueries";

export default function SqlRunner() {
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
                                setResults([])
                                setError(data.error);
                        } else {
                                setResults(data.rows || []);
                        }
                } catch (err: any) {
                        setError(err.message);
                }
        };

        useEffect(() => {
                runQuery(query);
        }, [query])

        return (
                <div className="px-8 py-4 h-screen flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                                <h1 className="text-xl font-bold">SQL Runner</h1>
                                <div className="border rounded overflow-hidden">
                                        <Editor
                                                height="200px"
                                                defaultLanguage="sql"
                                                value={query}
                                                onChange={debounce((value) => handleChange(value || ""), 300)}
                                                theme="vs-dark"
                                                options={{
                                                        minimap: { enabled: false },
                                                        fontSize: 14,
                                                        lineNumbers: "on",
                                                }}
                                        />
                                </div>
                                <div className="flex gap-2">
                                        <Button
                                                onClick={() => runQuery(query)}
                                        >
                                                Run Query
                                        </Button>
                                        <SavedQueries
                                                current={query}
                                                onSelect={function (sql: string): void {
                                                        setQuery(sql);
                                                }}
                                        />
                                        <ChatPane />
                                </div>
                        </div>
                        <div className="flex-1 border rounded overflow-hidden">
                                {error ?
                                        <div className="w-full h-full flex items-center justify-center flex-col gap-1">
                                                <div className="text-2xl">Syntax Error in your SQL Query</div>
                                                <div className="text-lg ">{error}</div>
                                        </div>
                                        : results.length
                                                ?
                                                <VirtualizedTable rows={results || []} />
                                                : <div className="w-full h-full flex items-center justify-center flex-col gap-1">
                                                        <div className="text-2xl">No results for the SQL query</div>
                                                </div>}
                        </div>
                </div>
        );
}