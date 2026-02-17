export default function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>Protected page </p>
      <a href="/api/me">Check /api/me</a><br></br>
      <a href="http://localhost:3001/dashboard">
        Go to Project A
      </a>
    </div>
  );
}