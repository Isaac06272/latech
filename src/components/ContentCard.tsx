'use client'

interface ContentCardProps {
  title: string
  summary1: string
  summary2: string
  btnText: string
  btnClass: string
  iconName: 'article' | 'code'
  href?: string
  target?: '_blank' | '_self'
}

export default function ContentCard({
  title,
  summary1,
  summary2,
  btnText,
  btnClass,
  iconName,
  href,
  target = '_blank',
}: ContentCardProps) {
  // Parse btnClass to get background and text colors
  const getIconBgClass = (cls: string) => {
    if (cls.includes('primary-container')) return 'bg-primary-container/20 text-primary'
    if (cls.includes('tertiary-container')) return 'bg-tertiary-container/20 text-tertiary'
    return 'bg-primary-container/20 text-primary'
  }

  const iconBgClass = getIconBgClass(btnClass)

  const CardWrapper = href ? 'a' : 'article'
  const wrapperProps = href ? { href, target, rel: 'noopener noreferrer' } : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className="bg-surface-container-lowest/80 rounded-sketchy p-gutter shadow-sm flex flex-col gap-element-gap hover:-translate-y-1 hover:rotate-1 transition-all duration-300 border-2 border-surface-variant/50 group cursor-pointer backdrop-blur-sm relative overflow-hidden h-full min-h-[280px]"
    >
      <div className="absolute top-2 right-2 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
        <span className="material-symbols-outlined text-4xl">
          {iconName === 'article' ? 'sticky_note_2' : 'code'}
        </span>
      </div>
      <header className="flex items-center gap-3 relative z-10">
        <div className={`${iconBgClass} p-2 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-sm">{iconName}</span>
        </div>
        <h3 className="font-headline-md text-[20px] text-on-surface line-clamp-1">{title}</h3>
      </header>
      <ul className="list-disc pl-5 font-headline-md text-[15px] text-on-surface-variant flex flex-col gap-1 marker:text-outline-variant relative z-10 flex-1">
        <li>{summary1}</li>
        <li>{summary2}</li>
      </ul>
      <div className="mt-auto pt-2 relative z-10">
        {href ? (
          <span className={`${btnClass} px-5 py-2 rounded-sketchy font-headline-md text-[14px] uppercase tracking-wider inline-flex items-center gap-2 hover:opacity-90 transition-opacity border-2 border-current hover:bg-transparent hover:text-current`}>
            {btnText}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        ) : (
          <button className={`${btnClass} px-5 py-2 rounded-sketchy font-headline-md text-[14px] uppercase tracking-wider inline-flex items-center gap-2 hover:opacity-90 transition-opacity border-2 border-current hover:bg-transparent hover:text-current`}>
            {btnText}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>
    </CardWrapper>
  )
}