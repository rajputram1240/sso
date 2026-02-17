export async function GET() {
  const auth = process.env.AUTH_SERVER;
  const client_id = process.env.CLIENT_ID;
  const redirect_uri = `${process.env.APP_URL}/sso/callback`;

  const url = new URL(`${auth}/authorize`);
  url.searchParams.set("client_id", client_id);
  url.searchParams.set("redirect_uri", redirect_uri);
  url.searchParams.set("state", "123");

  return Response.redirect(url.toString(), 302);
}