import sqlite3 from "sqlite3";
import Mock from "./mockData.json";
import moment from "moment";
const mockData = [...Mock];

const tableName = 'data';
let db: sqlite3.Database | null = null;
let initialized = false;

export function getDB() {
        if (!db) {
                db = new sqlite3.Database(":memory:");
        }

        if (!initialized) {
                initDB();
                initialized = true;
        }

        return db;
}

// Hardcoded schema definition
const schema = [
        { name: "id", type: "INTEGER" },
        { name: "first_name", type: "TEXT" },
        { name: "last_name", type: "TEXT" },
        { name: "country", type: "TEXT" },
        { name: "start_date", type: "DATE" },
        { name: "end_date", type: "DATE" },
        { name: "email", type: "TEXT" },
        { name: "gender", type: "TEXT" },
        { name: "amount", type: "INTEGER" },
        { name: "website", type: "TEXT" },
        { name: "image_url", type: "TEXT" },
        { name: "is_active", type: "INTEGER" }
];

function initDB() {
        if (!Array.isArray(mockData) || mockData.length === 0) {
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

                for (const row of mockData) {
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