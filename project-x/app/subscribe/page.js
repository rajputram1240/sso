"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Subscribe() {
  const params = useSearchParams();
  const planId = params.get("planId");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      setMsg("Processing subscription...");

      const me = await fetch("/api/me", { credentials: "include" });
      if (!me.ok) {
        setMsg("Not logged in. Please login first.");
        return;
      }

      const { userId } = await me.json();

      const r = await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId, months: 1 }),
      });

      if (!r.ok) {
        setMsg("Subscription failed");
        return;
      }

      setMsg("Subscription activated. Now open Project A (Product).");
    };

    run();
  }, [planId]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Subscribe</h2>
      <p>{msg}</p>
      <a href="http://localhost:3001/dashboard">Go to Project A Dashboard</a>
    </div>
  );
}