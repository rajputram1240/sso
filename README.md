Custom SSO Implementation (Node.js + Next.js)

This project demonstrates a simple custom Single Sign-On (SSO) implementation using a centralized Node.js authentication server and multiple Next.js client applications.
The system shows how multiple applications (Project A and Project X) can share authentication using an authorization code–based flow and JWT tokens.

Project Structure

SSO/
│
├── auth-server/   → Central authentication server (Node.js)
├── project-a/     → Next.js application (Port 3001)
├── project-x/     → Next.js application (Port 3000)
└── README.md


How It Works

A user opens Project A or Project X.
When login is required, the application redirects to the Auth Server.
The Auth Server validates credentials and creates a session.
The Auth Server returns an authorization code.
The client exchanges the code for a JWT access token.
The token is stored in an HTTP-only cookie.
The user can access both applications without logging in again.

This demonstrates centralized authentication and cross-application SSO.


Local Setup
1. Clone the repository

git clone <repo-url>
cd SSO

2. Start Auth Server

cd auth-server
npm install

Create .env inside auth-server:

PORT=4000
ISSUER=http://localhost:4000
JWT_SECRET=SUPER_SECRET_KEY
SSO_COOKIE=sso_sid

Run:
node index.js

Auth Server runs on:
http://localhost:4000

3. Start Project A
cd project-a
npm install

Create .env.local:
AUTH_SERVER=http://localhost:4000
CLIENT_ID=project-a
APP_URL=http://localhost:3001
JWT_SECRET=SUPER_SECRET_KEY

Run:
npm run dev

Project A runs on:
http://localhost:3001

4. Start Project X
cd project-x
npm install

Create .env.local:
AUTH_SERVER=http://localhost:4000
CLIENT_ID=project-x
APP_URL=http://localhost:3000
JWT_SECRET=SUPER_SECRET_KEY

Run:
npm run dev

Project X runs on:
http://localhost:3000

Testing the SSO

Open:
http://localhost:3001/login

Login with:
Email: demo@company.com

Password: 123456

After login, open:
http://localhost:3000/dashboard

You will not be asked to log in again.

