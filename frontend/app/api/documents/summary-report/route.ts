import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search;

  const accessToken = `Bearer ${req.cookies.get("access_token")?.value ?? ""}`;

  const res = await fetch(`${BACKEND_URL}/document/summary-report${search}`, {
    method: "GET",
    headers: {
      Authorization: accessToken,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}