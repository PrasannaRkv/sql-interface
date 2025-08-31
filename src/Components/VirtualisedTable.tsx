import { TableVirtuoso } from "react-virtuoso";

type ColSchema = {
        type: string;
        name: string;
}

export default function VirtualizedTable<T extends object>({ rows }: { rows: Array<T> }) {
        const colHeaders = Object.keys(rows?.[0] || {});
        return (
                <div className="h-[600px] w-full border rounded-xl overflow-hidden">
                        <TableVirtuoso
                                data={rows}
                                fixedHeaderContent={() => (
                                        <tr>
                                                {colHeaders.map((col) => (
                                                        <th key={col} className="px-4 py-2 text-left bg-gray-100 border-b">
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
                                                                <td key={col} className="px-4 py-2 border-b w-4 text-nowrap overflow-hidden text-ellipsis">
                                                                        {cellValue && String(cellValue)}
                                                                </td>
                                                        );
                                                })}
                                        </>
                                )}
                                components={{
                                        Table: (props) => <table {...props} className="w-full border-collapse table-fixed" />,
                                        TableHead: (props) => <thead {...props} className="sticky top-0 z-10" />,
                                        TableRow: (props) => <tr {...props} className="hover:bg-gray-50" />,
                                        TableBody: (props) => <tbody {...props} />,
                                }}
                        />
                </div>
        );
}