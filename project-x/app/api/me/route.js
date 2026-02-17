import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return Response.json({ userId: decoded.sub, client: decoded.aud });
  } catch {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }
}