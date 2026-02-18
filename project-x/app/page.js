export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Project X</h1>

      <a href="/sso/login">
        <button>Login with SSO</button>
      </a>

      <br /><br />

      <a href="/dashboard">
        <button>Go to Dashboard</button>
      </a>

       <a href="/pricing">
        <button>Subscription Plans</button>
      </a>
    </div>
  );
}