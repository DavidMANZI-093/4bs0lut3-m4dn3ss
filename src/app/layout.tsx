import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import SessionTimeoutHandler from '@/components/auth/SessionTimeoutHandler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '4bs0lut3-m4dn3ss Basketball Platform',
  description: 'Professional basketball team platform with ticketing, scoreboard, store, membership, and live chat systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <SessionTimeoutHandler />
        </AuthProvider>
      </body>
    </html>
  )
}