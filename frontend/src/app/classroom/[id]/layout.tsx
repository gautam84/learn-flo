import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/auth-context";

const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // customize weights as needed
  variable: '--font-cabin',
});


export const metadata: Metadata = {
  title: "LearnFlo",
  description: "LearnFlo is a platform for learning and sharing knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cabin.variable}  antialiased`}
      >
          {children}
      </body>
    </html>
  );
}
