import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LaTech Dashboard',
  description: 'Your intelligence digest for the week',
  icons: {
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJxjxRvu1UbNiCsPBXNIhaotWwMuqebhF902SAzlEqjfqjipTSW0ZWN55S3nNnwrjs2YbN4xoFUopQ92WRL3WnqZIQ_sunzN5mCmkGbjVmphW0iykhTtFwezuSltAGgHEl3grA1dTp5SgQkAgg5IV66GLUNNk60Ic8xM-ED5LP48J_6OR_-rlDIipXuBiUicAc8Rl6_ai5ZXFIZxjH3h_YBvdVUBulQntvhY1u_vcMD7hcLcGGjgugw',
    shortcut: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJxjxRvu1UbNiCsPBXNIhaotWwMuqebhF902SAzlEqjfqjipTSW0ZWN55S3nNnwrjs2YbN4xoFUopQ92WRL3WnqZIQ_sunzN5mCmkGbjVmphW0iykhTtFwezuSltAGgHEl3grA1dTp5SgQkAgg5IV66GLUNNk60Ic8xM-ED5LP48J_6OR_-rlDIipXuBiUicAc8Rl6_ai5ZXFIZxjH3h_YBvdVUBulQntvhY1u_vcMD7hcLcGGjgugw',
    apple: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJxjxRvu1UbNiCsPBXNIhaotWwMuqebhF902SAzlEqjfqjipTSW0ZWN55S3nNnwrjs2YbN4xoFUopQ92WRL3WnqZIQ_sunzN5mCmkGbjVmphW0iykhTtFwezuSltAGgHEl3grA1dTp5SgQkAgg5IV66GLUNNk60Ic8xM-ED5LP48J_6OR_-rlDIipXuBiUicAc8Rl6_ai5ZXFIZxjH3h_YBvdVUBulQntvhY1u_vcMD7hcLcGGjgugw',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}