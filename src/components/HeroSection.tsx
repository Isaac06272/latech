'use client'

export default function HeroSection() {
  const countdown = [
    { value: '03', label: 'Days' },
    { value: '14', label: 'Hours' },
    { value: '22', label: 'Mins' },
    { value: '45', label: 'Secs' },
  ]

  return (
    <header className="flex flex-col gap-base-unit bg-white/60 p-6 rounded-sketchy inline-block self-start border border-primary/20 rotate-1 shadow-sm">
      <h1 className="font-headline-xl text-headline-xl text-primary flex items-center gap-3">
        <span className="material-symbols-outlined text-4xl text-yellow-500 rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
          push_pin
        </span>
        Good morning, Alex! <span className="inline-block animate-bounce">👋</span>
      </h1>
      <p className="font-headline-md text-body-lg text-on-surface-variant ml-12">
        Here is your intelligence digest for the week of October 23rd.
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