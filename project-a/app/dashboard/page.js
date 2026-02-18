"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    fetch("/api/access", { credentials: "include" })
      .then(r => r.json())
      .then(d => setState({ loading: false, ...d }))
      .catch(() => setState({ loading: false, allowed: false }));
  }, []);

  if (state.loading) return <div style={{ padding: 40 }}>Loading...</div>;

  if (!state.allowed) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Astron Financial (Project A)</h2>
        <p>Subscription not active / expired for this product.</p>
        <a href="http://localhost:3000/pricing">Go to SaaS Portal (Project X)</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Astron Financial (Project A)</h2>
      <p>Access granted </p>
      <p>Plan: {state.planId} | Valid till: {state.validTill}</p>
      <a href="http://localhost:3000/pricing">Back to SaaS Portal (Project X)</a>
    </div>
  );
}