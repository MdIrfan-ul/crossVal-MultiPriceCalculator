import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    // Nest's default HttpException body looks like:
    // { statusCode, message, error }
    return NextResponse.json(
      { errorMessage: data.message ?? "Sign in failed" },
      { status: backendRes.status },
    );
  }

  const response = NextResponse.json(
    { accessToken: data.data.accessToken, user: data.data.user },
    { status: 200 },
  );

  // Store the access token ourselves as an httpOnly cookie — the backend
  // only returns it in the JSON body, it doesn't set a cookie for it.
  response.cookies.set("access_token", data.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Match your ACCESS_TOKEN env expiry (seconds). Adjust if different.
    maxAge: 60 * 60 * 8,
  });

  // Forward the backend's refresh_token cookie to the browser. fetch() on
  // the server doesn't auto-forward Set-Cookie, so we copy it manually.
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}