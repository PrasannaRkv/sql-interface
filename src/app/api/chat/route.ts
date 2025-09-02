import { NextResponse } from "next/server";
import OpenAI from "openai";
import { schema, tableName } from "../query/Table/data";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
          const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4.1" if you have access
      messages: [
        { role: "system", content: `You are an assistant that helps write SQL queries.
The table name is "${tableName}". Here is the database schema:

${schema.map((col) => `${col.name}: ${col.type}`).join("\n")}

Only generate valid SQL compatible with SQLite.`,},
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn’t generate SQL.";
//     const reply = "I couldn’t generate SQL.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}