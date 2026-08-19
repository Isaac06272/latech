'use client'

import TopNavBar from '@/components/TopNavBar'
import Link from 'next/link'
import { historyWeeks } from '@/data/historyData'

// Helper to parse inline style string to CSSProperties
function parseStyle(styleString: string): React.CSSProperties {
  const styles: Record<string, string> = {}
  styleString.split(';').forEach((rule) => {
    const [prop, val] = rule.split(':').map(s => s.trim())
    if (prop && val) {
      // Convert kebab-case to camelCase
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProp] = val
    }
  })
  return styles
}

export default function HistoryPage() {
  return (
    <div className="ruled-bg text-on-background font-body-md min-h-screen flex flex-col pt-[31px]">
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
          {historyWeeks.map((week, index) => (
            <section
              key={index}
              className={`relative bg-white/60 p-8 hand-drawn-border backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 shadow-card ${
                week.illegible ? 'opacity-80' : ''
              }`}
            >
              <div className="tape" style={week.tapeStyle ? parseStyle(week.tapeStyle) : undefined} />
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">{week.icon}</span>
                <h2 className="font-headline-md text-headline-md text-secondary font-handwritten text-2xl hand-drawn-highlight">
                  {week.week}
                </h2>
              </div>
              {week.illegible ? (
                <div className="flex items-center justify-center h-full text-on-surface-variant/50 font-handwritten text-xl italic">
                  Notes scribbled illegibly... 🖋️
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 border-l-2 border-primary-container border-dashed">
                  <div>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 font-handwritten text-lg uppercase tracking-wider">
                      {week.topSummary?.title}
                    </h3>
                    <p className="text-on-surface mb-4">{week.topSummary?.description}</p>
                    <div className="flex gap-2">
                      {week.topSummary?.tags.map((tag, i) => (
                        <span key={i} className={`px-3 py-1 ${tag.className} rounded-full text-sm font-handwritten`}>
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-2 font-handwritten text-lg uppercase tracking-wider">
                      {week.trendingRepos?.title}
                    </h3>
                    <ul className="space-y-2 list-none">
                      {week.trendingRepos?.items.map((item, i) => (
                        <li key={i}>
                          <a className="flex items-center gap-2 text-primary hover:text-surface-tint cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-sm">{item.icon}</span>
                            <span className="font-medium underline-wavy decoration-primary-fixed">{item.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
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