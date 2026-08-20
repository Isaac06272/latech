'use client'

import { useState, useEffect } from 'react'
import TopNavBar from '@/components/TopNavBar'
import Link from 'next/link'

interface DigestItem {
  id: string
  type: string
  date: string
  title: string
  content: string
  notion_page_id: string | null
  source_data: {
    url?: string
    html_url?: string
    link?: string
    source_url?: string
    [key: string]: unknown
  } | null
  updated_at: string
}

interface WeekData {
  weekLabel: string
  date: Date
  digests: DigestItem[]
  illegible?: boolean
  tapeStyle?: string
}

// Helper to parse inline style string to CSSProperties
function parseStyle(styleString: string): React.CSSProperties {
  const styles: Record<string, string> = {}
  styleString.split(';').forEach((rule) => {
    const [prop, val] = rule.split(':').map(s => s.trim())
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProp] = val
    }
  })
  return styles
}

// Helper to create 2-sentence summary from content
function getSummary(content: string): string {
  const sentences = content.split('. ').filter(Boolean)
  if (sentences.length === 0) return content
  if (sentences.length === 1) return sentences[0] + '.'
  return sentences[0] + '. ' + sentences[1] + '.'
}

// Extract source URL from source_data
function getSourceUrl(item: DigestItem): string | undefined {
  const sd = item.source_data
  if (!sd) return undefined
  return sd.url || sd.html_url || sd.link || sd.source_url || undefined
}

// Group digests by week (Monday-Sunday)
function groupByWeek(digests: DigestItem[]): WeekData[] {
  const weekMap = new Map<string, DigestItem[]>()

  digests.forEach(digest => {
    const date = new Date(digest.date)
    // Get Monday of that week
    const dayOfWeek = date.getDay() // 0 = Sunday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(date)
    monday.setDate(date.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)

    const weekKey = monday.toISOString().split('T')[0]
    if (!weekMap.has(weekKey)) weekMap.set(weekKey, [])
    weekMap.get(weekKey)!.push(digest)
  })

  // Convert to array and sort by week (newest first)
  const weeks: WeekData[] = Array.from(weekMap.entries())
    .map(([weekKey, digests]) => {
      const monday = new Date(weekKey)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)

      const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const weekLabel = `Week of ${formatDate(monday)}`

      return {
        weekLabel,
        date: monday,
        digests,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((week, index) => ({
      ...week,
      tapeStyle: ["", "transform: translateX(-50%) rotate(1deg); width: 60px;", "transform: translateX(-50%) rotate(-3deg); left: 80%;"][index] || ""
    }))

  return weeks
}

export default function HistoryPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDigests = async () => {
      try {
        const res = await fetch('/api/digests')
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Failed to fetch')

        const allDigests: DigestItem[] = json.data || []
        const grouped = groupByWeek(allDigests)
        setWeeks(grouped)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDigests()
  }, [])

  if (loading) {
    return (
      <div className="ruled-bg text-on-background font-body-md min-h-screen flex flex-col pt-0">
        <TopNavBar />
        <main className="max-w-4xl mx-auto px-container-padding py-section-gap ml-[40px] md:ml-auto flex-grow">
          <header className="mb-12 relative">
            <div className="tape hidden md:block" style={{ left: '20%', transform: 'rotate(3deg)' }} />
            <h1 className="font-headline-xl text-headline-xl text-primary font-handwritten mb-4">Past Insights</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant font-handwritten text-2xl">
              A little trip down memory lane... 🕰️
            </p>
          </header>
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <section key={i} className="relative bg-white/60 p-8 hand-drawn-border backdrop-blur-sm animate-pulse">
                <div className="tape"></div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">event</span>
                  <div className="h-8 bg-surface-variant/30 rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 border-l-2 border-primary-container border-dashed">
                  <div className="space-y-3">
                    <div className="h-6 bg-surface-variant/30 rounded w-1/2"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-surface-variant/30 rounded px-3"></div>
                      <div className="h-6 bg-surface-variant/30 rounded px-3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-surface-variant/30 rounded w-1/2"></div>
                    <div className="h-8 bg-surface-variant/30 rounded w-1/2"></div>
                    <div className="h-8 bg-surface-variant/30 rounded w-1/2"></div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ruled-bg text-on-background font-body-md min-h-screen flex flex-col pt-0">
        <TopNavBar />
        <main className="max-w-4xl mx-auto px-container-padding py-section-gap ml-[40px] md:ml-auto flex-grow">
          <header className="mb-12 relative">
            <div className="tape hidden md:block" style={{ left: '20%', transform: 'rotate(3deg)' }} />
            <h1 className="font-headline-xl text-headline-xl text-primary font-handwritten mb-4">Past Insights</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant font-handwritten text-2xl">
              A little trip down memory lane... 🕰️
            </p>
          </header>
          <div className="text-center text-error py-12">
            <span className="material-symbols-outlined text-6xl">error</span>
            <p className="mt-4">Failed to load history: {error}</p>
          </div>
        </main>
      </div>
    )
  }

  if (weeks.length === 0) {
    return (
      <div className="ruled-bg text-on-background font-body-md min-h-screen flex flex-col pt-0">
        <TopNavBar />
        <main className="max-w-4xl mx-auto px-container-padding py-section-gap ml-[40px] md:ml-auto flex-grow">
          <header className="mb-12 relative">
            <div className="tape hidden md:block" style={{ left: '20%', transform: 'rotate(3deg)' }} />
            <h1 className="font-headline-xl text-headline-xl text-primary font-handwritten mb-4">Past Insights</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant font-handwritten text-2xl">
              A little trip down memory lane... 🕰️
            </p>
          </header>
          <div className="text-center text-on-surface-variant py-12">
            <span className="material-symbols-outlined text-6xl">history</span>
            <p className="mt-4">No digests yet. Make.com will populate this over time.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="ruled-bg text-on-background font-body-md min-h-screen flex flex-col pt-0">
      <TopNavBar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-container-padding py-section-gap ml-[40px] md:ml-auto flex-grow">
        <header className="mb-12 relative">
          <div className="tape hidden md:block" style={{ left: '20%', transform: 'rotate(3deg)' }} />
          <h1 className="font-headline-xl text-headline-xl text-primary font-handwritten mb-4">Past Insights</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-handwritten text-2xl">
            A little trip down memory lane... 🕰️
          </p>
        </header>

        <div className="space-y-12">
          {weeks.map((week, index) => (
            <section
              key={index}
              className={`relative bg-white/60 p-8 hand-drawn-border backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 shadow-card ${week.illegible ? 'opacity-80' : ''}`}
            >
              <div className="tape" style={week.tapeStyle ? parseStyle(week.tapeStyle) : undefined} />
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">event</span>
                <h2 className="font-headline-md text-headline-md text-secondary font-handwritten text-2xl hand-drawn-highlight">
                  {week.weekLabel}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 border-l-2 border-primary-container border-dashed">
                {/* Left: AI Digests */}
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 font-handwritten text-lg uppercase tracking-wider">
                    Top Summary
                  </h3>
                  {week.digests
                    .filter(d => ['ai', 'technology'].includes(d.type))
                    .slice(0, 5)
                    .map((digest, i) => {
                      const sourceUrl = getSourceUrl(digest)
                      return (
                        <a
                          key={digest.id || i}
                          href={sourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-3 text-on-surface hover:text-primary transition-colors group flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-primary text-sm">article</span>
                          <span className="font-medium underline decoration-wavy decoration-primary/50 underline-offset-2">
                            {digest.title}
                          </span>
                        </a>
                      )
                    })}
                  {week.digests.filter(d => ['ai', 'technology'].includes(d.type)).length === 0 && (
                    <p className="text-on-surface-variant/50 font-handwritten text-xl italic">
                      No AI insights this week... 🤖
                    </p>
                  )}
                </div>

                {/* Right: Repo Digests */}
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 font-handwritten text-lg uppercase tracking-wider">
                    Trending Repos
                  </h3>
                  {week.digests
                    .filter(d => ['repo', 'github'].includes(d.type))
                    .slice(0, 5)
                    .map((digest, i) => {
                      const sourceUrl = getSourceUrl(digest)
                      return (
                        <a
                          key={digest.id || i}
                          href={sourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-3 text-on-surface hover:text-tertiary transition-colors group flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-tertiary text-sm">star</span>
                          <span className="font-medium underline decoration-dashed decoration-tertiary/50 underline-offset-2">
                            {digest.title}
                          </span>
                        </a>
                      )
                    })}
                  {week.digests.filter(d => ['repo', 'github'].includes(d.type)).length === 0 && (
                    <p className="text-on-surface-variant/50 font-handwritten text-xl italic">
                      No trending repos this week... 📦
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md shadow-[0px_-10px_30px_rgba(0,0,0,0.04)] flex justify-around py-4 z-50 border-t border-surface-variant/50">
        <Link href="/" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-caps text-[10px] font-handwritten">Dashboard</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1 text-primary">
          <div className="bg-primary-container px-4 py-1 rounded-full hand-drawn-border">
            <span className="material-symbols-outlined text-on-primary-container">history</span>
          </div>
          <span className="font-label-caps text-[10px] font-handwritten font-bold">History</span>
        </Link>
      </nav>
    </div>
  )
}