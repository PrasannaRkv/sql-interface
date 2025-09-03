import { TableVirtuoso } from "react-virtuoso";
import { Button } from "./ui/button";

export default function VirtualizedTable<T extends object>({ rows }: { rows: Array<T> }) {
        const colHeaders = Object.keys(rows?.[0] || {});

        const toCSV = (data: any[]) => {
                if (data.length === 0) return "";
                const headers = Object.keys(data[0]);
                const csvRows = [
                        headers.join(","), // header row
                        ...data.map((row) =>
                                headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
                        ),
                ];
                return csvRows.join("\n");
        };

        const toJSON = (data: any[]) => JSON.stringify(data, null, 2);

        const copyCSV = () => navigator.clipboard.writeText(toCSV(rows));
        const copyJSON = () => navigator.clipboard.writeText(toJSON(rows));

        const download = (content: string, type: string, filename: string) => {
                const blob = new Blob([content], { type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
        };

        return (
                <div className="h-full w-full">
                        <div className="flex gap-2 p-2 bg-muted">
                                <div className="flex-1"> Results</div>
                                <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={copyCSV}>
                                                Copy CSV
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={copyJSON}>
                                                Copy JSON
                                        </Button>
                                        <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => download(toCSV(rows), "text/csv", "data.csv")}
                                        >
                                                Download CSV
                                        </Button>
                                        <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                        download(toJSON(rows), "application/json", "data.json")
                                                }
                                        >
                                                Download JSON
                                        </Button>
                                </div>
                        </div>

                        <TableVirtuoso
                                data={rows}
                                fixedHeaderContent={() => (
                                        <tr className="bg-background">
                                                {colHeaders.map((col) => (
                                                        <th key={col} className="px-4 py-2 text-left bg-foreground/20 border-b">
                                                                {col}
                                                        </th>
                                                ))}
                                        </tr>
                                )}
                                itemContent={(index, row) => (
                                        <>
                                                {colHeaders.map((col) => {
                                                        // @ts-ignore-next-line
                                                        const cellValue = row[col];
                                                        return (
                                                                <td key={col} className="px-4 py-2 border-b w-4 text-nowrap overflow-hidden text-ellipsis max-w-40 min-w-40">
                                                                        {cellValue && String(cellValue)}
                                                                </td>
                                                        );
                                                })}
                                        </>
                                )}
                                components={{
                                        Table: (props) => <table {...props} className="w-full border-collapse" />,
                                        TableHead: (props) => <thead {...props} className="sticky top-0 z-10" />,
                                        TableRow: (props) => <tr {...props} className="hover:bg-foreground/40" />,
                                        TableBody: (props) => <tbody {...props} />,
                                }}
                        />
                </div>
        );
}