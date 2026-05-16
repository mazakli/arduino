import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      ? process.env.GOOGLE_CLIENT_ID.slice(0, 25) + "..."
      : "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
    DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
