import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "꼬들7",
  description: "매일 업데이트되는 7칸 꼬들문제!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
