export const metadata = {
  title: "Project X",
  description: "SSO Client",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}