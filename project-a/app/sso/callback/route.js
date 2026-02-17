import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const auth = process.env.AUTH_SERVER;
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = `${process.env.APP_URL}/sso/callback`;

  const r = await fetch(`${auth}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, client_id, redirect_uri }),
  });

  const data = await r.json();

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("accessToken", data.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res;
}