import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth.config";
import { error } from "console";

export async function GET() {
  try {
    const posts = await sql`SELECT * FROM posts ORDER BY date DESC LIMIT 2;`;
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const content = searchParams.get("content");
  const date = searchParams.get("date");
  const author = searchParams.get("author");

  try {
    if (!session) {
      return NextResponse.json(
        { message: "user not authenticated" },
        { status: 401 }
      );
    }
    // SQL query to insert a new post
    await sql`INSERT  INTO posts (id,author,title,content,date) VALUES (${id},${author},${title},${content},${date});`;
    return NextResponse.json(
      { message: "post sucessfully added" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
    console.log("Del Request: " + id);
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    if (!session) {
      return NextResponse.json(
        { message: "user not authenticated" },
        { status: 401 }
      );
    }

    await sql`DELETE FROM posts WHERE id = ${id};`;
    return NextResponse.json(
      { message: "post sucessfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
