import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;
    const accessToken = req.cookies.get("access_token")?.value ?? "";

    const backendRes = await fetch(`${BACKEND_URL}/documents${search}`, {
        method: "GET",
        headers: { auth: accessToken },
        cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const accessToken = req.cookies.get("access_token")?.value ?? "";

    const backendRes = await fetch(`${BACKEND_URL}/documents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            auth: accessToken,
        },
        body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}