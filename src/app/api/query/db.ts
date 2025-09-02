import sqlite3 from "sqlite3";
import moment from "moment";
import { tableName, schema, data } from "./Table/data";

let db: sqlite3.Database | null = null;
let initialized = false;

export function getDB() {
        if (!db) {
                db = new sqlite3.Database(":memory:");
        }

        if (!initialized) {
                initDB({ tableName, schema, data });
                initialized = true;
        }

        return db;
}

function initDB({ tableName, data, schema }: { tableName: string, data: object[], schema: Array<{ name: string, type: string }> }) {
        if (!Array.isArray(data) || data.length === 0) {
                return;
        }

        const colDefs = schema.map((c) => `"${c.name}" ${c.type}`).join(", ");

        db!.serialize(() => {
                db!.run("DROP TABLE IF EXISTS data");
                db!.run(`CREATE TABLE ${tableName} (${colDefs})`);

                const columns = schema.map((c) => `"${c.name}"`);
                const placeholders = schema.map(() => "?").join(", ");
                const stmt = db!.prepare(
                        `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`
                );

                for (const row of data) {
                        stmt.run(schema.map((c) => {
                                const name = c.name;
                                // @ts-ignore-next-line
                                const val = row[name];
                                if (c.type === "INTEGER" && typeof val === "boolean") {
                                        return val ? 1 : 0;
                                }
                                if (c.type === "DATE") {
                                        return moment(val).format('YYYY-MM-DD')
                                }
                                return val;
                        }));
                }

                stmt.finalize();
        });
}