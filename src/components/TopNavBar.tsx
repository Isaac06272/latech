'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/history', label: 'History' },
]

export default function TopNavBar() {
  const pathname = usePathname()

  return (
    <nav className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md shadow-cloud flex justify-between items-center px-container-padding py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <img
          alt="LaTech Logo"
          className="w-12 h-12 rounded-full hand-drawn-border p-1"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJxjxRvu1UbNiCsPBXNIhaotWwMuqebhF902SAzlEqjfqjipTSW0ZWN55S3nNnwrjs2YbN4xoFUopQ92WRL3WnqZIQ_sunzN5mCmkGbjVmphW0iykhTtFwezuSltAGgHEl3grA1dTp5SgQkAgg5IV66GLUNNk60Ic8xM-ED5LP48J_6OR_-rlDIipXuBiUicAc8Rl6_ai5ZXFIZxjH3h_YBvdVUBulQntvhY1u_vcMD7hcLcGGjgugw"
        />
        <span className="font-headline-md text-headline-md font-bold text-primary font-handwritten text-3xl">LaTech</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 items-center font-handwritten text-xl">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors duration-200 hover:scale-105 ${
              pathname === link.href
                ? 'text-primary border-b-2 border-primary pb-1 hand-drawn-highlight'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Trailing Icons */}
      <div className="flex gap-4 items-center">
        <button className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95" aria-label="Calendar">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
        </button>
        <button className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95" aria-label="Notifications">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
        </button>
        <button className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95" aria-label="Account">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
        </button>
      </div>
    </nav>
  )
}