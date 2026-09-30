import "./globals.css";

export const metadata = {
  title: "SkillSync - Learn. Share. Grow.",
  description:
    "AI-powered skill learning, mentorship and skill swapping platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}