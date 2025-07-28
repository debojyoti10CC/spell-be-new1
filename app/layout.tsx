import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Play & Learn: Game Zone - IEM & UEM Spell-a-thon 2024",
  description:
    "Educational gaming platform for college students. Master IELTS-level vocabulary, reading comprehension, academic writing, and listening skills through interactive games. Developed by IEM & UEM for Spell-a-thon 2024.",
  keywords:
    "IELTS, vocabulary, academic English, college students, educational games, reading comprehension, academic writing, listening skills, IEM, UEM, spell-a-thon",
  authors: [{ name: "IEM & UEM" }],
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
