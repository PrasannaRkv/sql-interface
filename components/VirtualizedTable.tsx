import { TableVirtuoso } from "react-virtuoso";
import { CopyButton } from "./CopyButton";
import { DownloadButton } from "./DownloadButton";

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

        return (
                <div className="h-full w-full">
                        <div className="flex gap-2 p-2 bg-muted px-4">
                                <div className="flex-1">Results</div>
                                <div className="flex gap-2">
                                        <CopyButton getData={() => toCSV(rows)} format="csv" />
                                        <CopyButton getData={() => toJSON(rows)} format="json" />
                                        <DownloadButton getData={() => toCSV(rows)} format="csv" />
                                        <DownloadButton getData={() => toJSON(rows)} format="json" />
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