import sqlite3 from "sqlite3";
import moment from "moment";
import * as table1 from "./Table/data";
import * as table2 from "./Table/filght_data";

let db: sqlite3.Database | null = null;
let initialized = false;

export function getDB() {
        if (!db) {
                db = new sqlite3.Database(":memory:");
        }

        if (!initialized) {
                db!.serialize(() => {
                        db!.run("DROP TABLE IF EXISTS data");
                });
                initDB(table1);
                initDB(table2);
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