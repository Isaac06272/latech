'use client'

import { useState, useEffect } from 'react'
import TopNavBar from '@/components/TopNavBar'
import HeroSection from '@/components/HeroSection'
import ContentCard from '@/components/ContentCard'

interface DigestItem {
  id: string;
  type: string;
  date: string;
  title: string;
  content: string;
  notion_page_id: string | null;
  source_data: {
    url?: string;
    html_url?: string;
    link?: string;
    source_url?: string;
    [key: string]: unknown;
  } | null;
  updated_at: string;
}

export default function DashboardPage() {
  const [aiDigests, setAiDigests] = useState<DigestItem[]>([])
  const [repoDigests, setRepoDigests] = useState<DigestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDigests = async () => {
      try {
        const res = await fetch('/api/digests')
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Failed to fetch')

        const allDigests: DigestItem[] = json.data || []

        // Find the latest date across all digests
        const dates = allDigests.map(d => d.date).filter(Boolean)
        const latestDate = dates.length > 0 ? dates.reduce((a, b) => a > b ? a : b) : null

        // Filter to only the latest week
        const latestDigests = latestDate
          ? allDigests.filter(d => d.date === latestDate)
          : []

        // Map types: 'ai', 'technology' -> AI column | 'repo', 'github' -> Repo column
        const aiTypes = ['ai', 'technology']
        const repoTypes = ['repo', 'github']
        setAiDigests(latestDigests.filter(d => aiTypes.includes(d.type)))
        setRepoDigests(latestDigests.filter(d => repoTypes.includes(d.type)))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDigests()
  }, [])

  // Helper to create summary from content
  const getSummaries = (content: string) => {
    const sentences = content.split('. ').filter(Boolean)
    return {
      summary1: sentences[0] ? sentences[0] + '.' : 'Initial tests show promising results.',
      summary2: sentences[1] ? sentences[1] + '.' : 'Further validation is underway.'
    }
  }

  // Extract source URL from source_data
  const getSourceUrl = (item: DigestItem): string | undefined => {
    const sd = item.source_data
    if (!sd) return undefined
    // Try common URL fields
    return sd.url || sd.html_url || sd.link || sd.source_url || undefined
  }

  if (loading) {
    return (
      <div className="ruled-bg text-on-background font-headline-md text-body-md antialiased min-h-screen flex flex-col pt-[31px]">
        <TopNavBar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-container-padding py-section-gap flex flex-col gap-section-gap z-10 relative">
          <HeroSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <section className="bg-primary-container/20 sketchy-border p-container-padding flex flex-col gap-element-gap relative">
              <div className="flex items-center gap-2 mb-base-unit text-primary ml-4">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <h2 className="font-headline-lg text-headline-lg underline decoration-wavy decoration-primary/50 underline-offset-4">Latest in AI</h2>
              </div>
              <div className="flex flex-col gap-element-gap">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-surface-container-lowest/80 rounded-sketchy p-gutter animate-pulse">
                    <div className="h-6 bg-surface-variant/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-tertiary-container/30 sketchy-border-tertiary p-container-padding flex flex-col gap-element-gap relative">
              <div className="flex items-center gap-2 mb-base-unit text-tertiary">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>folder_special</span>
                <h2 className="font-headline-lg text-headline-lg underline decoration-dashed decoration-tertiary/50 underline-offset-4">Trending Repos</h2>
              </div>
              <div className="flex flex-col gap-element-gap">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-surface-container-lowest/80 rounded-sketchy p-gutter animate-pulse">
                    <div className="h-6 bg-surface-variant/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-surface-variant/30 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ruled-bg text-on-background font-headline-md text-body-md antialiased min-h-screen flex flex-col pt-[31px]">
        <TopNavBar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-container-padding py-section-gap flex flex-col gap-section-gap z-10 relative">
          <HeroSection />
          <div className="text-center text-error py-12">
            <span className="material-symbols-outlined text-6xl">error</span>
            <p className="mt-4">Failed to load digests: {error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="ruled-bg text-on-background font-headline-md text-body-md antialiased min-h-screen flex flex-col pt-[31px]">
      <TopNavBar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-container-padding py-section-gap flex flex-col gap-section-gap z-10 relative">
        <HeroSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Column 1: Latest in AI */}
          <section className="bg-primary-container/20 sketchy-border p-container-padding flex flex-col gap-element-gap relative">
            <div className="absolute -top-4 -left-4 bg-yellow-200 text-yellow-800 rounded-full p-2 shadow-md transform -rotate-12 border border-yellow-400 z-10">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <div className="flex items-center gap-2 mb-base-unit text-primary ml-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
              <h2 className="font-headline-lg text-headline-lg underline decoration-wavy decoration-primary/50 underline-offset-4">
                Latest in AI
              </h2>
            </div>
            <div className="flex flex-col gap-element-gap" id="ai-cards-container">
              {aiDigests.length > 0 ? (
                aiDigests.map((topic, index) => {
                  const { summary1, summary2 } = getSummaries(topic.content)
                  const sourceUrl = getSourceUrl(topic)
                  return (
                    <ContentCard
                      key={topic.id || index}
                      title={topic.title}
                      summary1={summary1}
                      summary2={summary2}
                      btnText="Read Article"
                      btnClass="bg-primary-container text-on-primary-container border-primary-container"
                      iconName="article"
                      href={sourceUrl}
                    />
                  )
                })
              ) : (
                <div className="text-center text-on-surface-variant py-8">
                  <span className="material-symbols-outlined text-4xl">inbox</span>
                  <p className="mt-2">No AI digests yet. Make.com will populate this.</p>
                </div>
              )}
            </div>
          </section>

          {/* Column 2: Trending Repos */}
          <section className="bg-tertiary-container/30 sketchy-border-tertiary p-container-padding flex flex-col gap-element-gap relative">
            <div className="absolute -top-3 -right-3 bg-blue-200 text-blue-800 rounded-full p-2 shadow-md transform rotate-12 border border-blue-400 z-10">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
            </div>
            <div className="flex items-center gap-2 mb-base-unit text-tertiary">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                folder_special
              </span>
              <h2 className="font-headline-lg text-headline-lg underline decoration-dashed decoration-tertiary/50 underline-offset-4">
                Trending Repos
              </h2>
            </div>
            <div className="flex flex-col gap-element-gap" id="repo-cards-container">
              {repoDigests.length > 0 ? (
                repoDigests.map((topic, index) => {
                  const { summary1, summary2 } = getSummaries(topic.content)
                  const sourceUrl = getSourceUrl(topic)
                  return (
                    <ContentCard
                      key={topic.id || index}
                      title={topic.title}
                      summary1={summary1}
                      summary2={summary2}
                      btnText="View on GitHub"
                      btnClass="bg-tertiary-container text-tertiary border-tertiary-container"
                      iconName="code"
                      href={sourceUrl}
                    />
                  )
                })
              ) : (
                <div className="text-center text-on-surface-variant py-8">
                  <span className="material-symbols-outlined text-4xl">inbox</span>
                  <p className="mt-2">No repo digests yet. Make.com will populate this.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}