'use client'

import TopNavBar from '@/components/TopNavBar'
import HeroSection from '@/components/HeroSection'
import ContentCard from '@/components/ContentCard'
import { aiTopics, repoTopics } from '@/data/dashboardData'

export default function DashboardPage() {
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
              {aiTopics.map((topic, index) => (
                <ContentCard
                  key={index}
                  title={topic.title}
                  summary1={topic.summary1}
                  summary2={topic.summary2}
                  btnText="Read More"
                  btnClass="bg-primary-container text-on-primary-container border-primary-container"
                  iconName="article"
                />
              ))}
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
              {repoTopics.map((topic, index) => (
                <ContentCard
                  key={index}
                  title={topic.title}
                  summary1={topic.summary1}
                  summary2={topic.summary2}
                  btnText="View on GitHub"
                  btnClass="bg-tertiary-container text-tertiary border-tertiary-container"
                  iconName="code"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}