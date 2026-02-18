import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return Response.json({ allowed: false }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.sub;
  } catch {
    return Response.json({ allowed: false }, { status: 401 });
  }

  const ent = await fetch(`http://localhost:4000/entitlements/${userId}`, {
    cache: "no-store",
  });

  const data = await ent.json();

  const allowed =
    data.status === "ACTIVE" &&
    (data.products || []).includes("ASTRON_FIN");

  return Response.json({
    allowed,
    status: data.status,
    planId: data.planId,
    validTill: data.validTill,
  });
}