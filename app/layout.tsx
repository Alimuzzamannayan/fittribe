import type { Metadata } from 'next'
import { Oswald, Mulish } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets:  ['latin'],
  variable: '--font-oswald',
  weight:   ['300', '400', '500', '600', '700'],
})

const mulish = Mulish({
  subsets:  ['latin'],
  variable: '--font-mulish',
  weight:   ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title:       'Body Analytics — Personal Fitness Dashboard',
  description: 'Enter your body measurements and get an instant personalised fitness dashboard with BMI, body composition, health ratios, and a 6-month action plan.',
  openGraph: {
    title:       'Body Analytics Dashboard',
    description: 'Your personal fitness metrics, visualised.',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${mulish.variable}`}>
      <body className="bg-[#f7f4ef] text-[#1c1810] font-mulish antialiased">
        {children}
      </body>
    </html>
  )
}
