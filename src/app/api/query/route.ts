import { NextResponse } from "next/server";
import { getDB } from "./db";

export async function POST(req: Request): Promise<Response> {
  const db = getDB();

  try {
    const { sql } = await req.json();
    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 });
    }

    const result = await new Promise<Response>((resolve) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 400 }));
        } else {
          resolve(NextResponse.json({ rows }));
        }
      });
    });

    return result;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}