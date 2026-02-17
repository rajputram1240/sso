import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) return new NextResponse("Missing code", { status: 400 });

    const auth = process.env.AUTH_SERVER || "http://localhost:4000";
    const client_id = process.env.CLIENT_ID || "project-x";
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const redirect_uri = `${appUrl}/sso/callback`;

    const r = await fetch(`${auth}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, client_id, redirect_uri }),
    });

    const text = await r.text();
    if (!r.ok) {
      return new NextResponse(
        `Token exchange failed\nStatus: ${r.status}\nBody: ${text}`,
        { status: 401 }
      );
    }

    const data = JSON.parse(text);

    const res = NextResponse.redirect(new URL("/", req.url));

    res.cookies.set("accessToken", data.access_token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    return new NextResponse(`Callback error: ${err?.message || err}`, {
      status: 500,
    });
  }
}