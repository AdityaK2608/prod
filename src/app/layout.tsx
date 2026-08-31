import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepPath — Your Exam Preparation Command Center",
  description: "Plan, track, revise, and improve your preparation for any exam.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
