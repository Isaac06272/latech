'use client'

import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [refreshWeek, setRefreshWeek] = useState('')

  useEffect(() => {
    // Calculate time until next Monday 10 AM Philippine Time (UTC+8)
    const calculateTimeLeft = () => {
      const now = new Date()
      // Get current time in Philippine Time (UTC+8)
      const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }))

      // Find the CURRENT week's Monday (the Monday whose data is displayed)
      const currentMonday = new Date(phTime)
      const dayOfWeek = phTime.getDay() // 0 = Sunday, 1 = Monday, etc.
      let daysSinceMonday: number

      if (dayOfWeek === 1) {
        // Monday: check if after 10 AM (data refreshed) or before 10 AM (still last week's data)
        daysSinceMonday = phTime.getHours() >= 10 ? 0 : 7
      } else if (dayOfWeek === 0) {
        // Sunday -> last Monday was 6 days ago
        daysSinceMonday = 6
      } else {
        // Tue=1, Wed=2, Thu=3, Fri=4, Sat=5 days since Monday
        daysSinceMonday = dayOfWeek - 1
      }

      currentMonday.setDate(phTime.getDate() - daysSinceMonday)
      currentMonday.setHours(10, 0, 0, 0)

      // Format the current week's Monday for display (e.g., "August 17")
      const weekLabel = currentMonday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      setRefreshWeek(weekLabel)

      // Find NEXT Monday 10 AM for countdown (always +7 days from current week's Monday)
      const nextMonday = new Date(currentMonday)
      nextMonday.setDate(currentMonday.getDate() + 7)

      const diff = nextMonday.getTime() - phTime.getTime()

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    const updateTimeLeft = () => {
      setTimeLeft(calculateTimeLeft())
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  const countdown = [
    { value: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
    { value: String(timeLeft.hours).padStart(2, '0'), label: 'Hours' },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Mins' },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Secs' },
  ]

  return (
    <header className="flex flex-col gap-base-unit bg-white/60 p-6 rounded-sketchy inline-block self-start border border-primary/20 rotate-1 shadow-sm">
      <h1 className="font-headline-xl text-headline-xl text-primary flex items-center gap-3">
        <span className="material-symbols-outlined text-4xl text-yellow-500 rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
          push_pin
        </span>
        Good morning, Isaac! <span className="inline-block animate-bounce">👋</span>
      </h1>
      <p className="font-headline-md text-body-lg text-on-surface-variant ml-12">
        Here is your intelligence digest for the week of {refreshWeek || 'loading...'}.
      </p>
      <div className="ml-12 mt-4 flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          {countdown.map((item, index) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="flex flex-col items-center bg-primary-container/30 p-2 rounded-sketchy border border-primary/20 min-w-[60px]">
                <span className="text-headline-md font-bold text-primary">{item.value}</span>
                <span className="text-label-caps text-on-surface-variant">{item.label}</span>
              </div>
              {index < countdown.length - 1 && <div className="text-headline-md text-primary">:</div>}
            </div>
          ))}
        </div>
        <p className="text-label-caps text-on-surface-variant italic flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">info</span>
          AI automation refresh every Monday 10 AM Philippine Time
        </p>
      </div>
    </header>
  )
}