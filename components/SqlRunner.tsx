"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { debounce } from "@/lib/utils";
import { useQueryState } from "@/utils/useQueryState";
import VirtualizedTable from "@/components/VirtualizedTable";
import { Button } from "@/components/ui/button";
import ChatPane from "@/components/ChatPane";
import SavedQueries from "./SavedQueries";
import { useFetch } from "@/utils/useFetch";

export default function SqlRunner() {
        const [results, setResults] = useState<any[]>([]);

        const { query, setQuery } = useQueryState("q", "SELECT * FROM data;"); // stored in ?q=<base64>

        const handleChange = (value: string | undefined) => {
                const query = value || "";
                setQuery(query);
        };

        const { data, error, loading, run } = useFetch<{ rows: any[]; error?: string }>(
                "/api/query",
                { method: "POST", skip: true }
        );

        useEffect(() => {
                if (query) {
                        run({ sql: query });
                }
        }, [query, run]);

        useEffect(() => {
                if (data) {
                        if (data.error) {
                                setResults([]);
                        } else {
                                setResults(data.rows || []);
                        }
                }
        }, [data]);

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
                                                onClick={() => { run({ sql: query }) }}
                                        >
                                                Run Query
                                        </Button>
                                        <SavedQueries
                                                current={query}
                                                onSelect={function (sql: string): void {
                                                        setQuery(sql);
                                                }}
                                        />
                                        <ChatPane query={query} />
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