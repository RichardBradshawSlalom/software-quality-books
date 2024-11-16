import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from 'next-auth'
import Navigation from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Software Quality Books",
  description: "The best place to find sodtware quality books reviewed by the community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
