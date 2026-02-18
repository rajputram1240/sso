"use client";

import { useEffect, useState } from "react";

export default function Pricing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/plans")
      .then(r => r.json())
      .then(d => setPlans(d.plans || []));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Pricing (Project A - SaaS Portal)</h2>

      {plans.map(p => (
        <div key={p.id} style={{ marginTop: 15 }}>
          <b>{p.name}</b> - ₹{p.price}/month
          <div style={{ marginTop: 8 }}>
            <a href={`/subscribe?planId=${p.id}`}>
              <button>Buy {p.name}</button>
            </a>
          </div>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <a href="http://localhost:3001/dashboard">Open Product (Project A)</a>
    </div>
  );
}