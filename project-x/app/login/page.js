"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@company.com");
  const [password, setPassword] = useState("123456");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("Logging in...");

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setMsg("Login failed");
      return;
    }

    setMsg("SSO login success. Redirecting...");
    window.location.href = "/sso/login";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>SSO Login (Auth Server)</h2>

      <div style={{ marginTop: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleLogin}>Login</button>
      </div>

      <p style={{ marginTop: 10 }}>{msg}</p>
    </div>
  );
}