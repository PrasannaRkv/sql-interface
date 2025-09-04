import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Tables } from "../query/Table"

const getTableInfo = ({ schema, tableName }: { schema: { name: string, type: string }[], tableName: string }) => {
  return `The table name is "${tableName}". Here is the database schema:

${schema.map((col) => `${col.name}: ${col.type}`).join("\n")}

`
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_AWARE = `
You are an assistant that helps write SQL queries.

${Tables.map((table, i) => `
Table ${i}:
${getTableInfo(table)}
`).join('\n')}

Only generate valid SQL compatible with SQLite.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4.1" if you have access
      messages: [
        {
          role: "system", content: SYSTEM_AWARE,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn’t generate SQL.";

    return NextResponse.json({ reply: reply + ' \n\nWould you like help with something else?' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}