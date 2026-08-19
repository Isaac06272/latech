export const historyWeeks = [
  {
    week: 'Week of Oct 16th',
    icon: 'event',
    topSummary: {
      title: 'Top Summary',
      description: 'AI automation took a massive leap this week with new open-source agent frameworks. We saw a 40% reduction in cognitive load for basic dev tasks.',
      tags: [
        { text: '#AI', className: 'bg-primary-container text-on-primary-container' },
        { text: '#Agents', className: 'bg-secondary-container text-on-secondary-container' },
      ],
    },
    trendingRepos: {
      title: 'Trending Repos',
      items: [
        { name: 'auto-coder-v2', icon: 'star' },
        { name: 'zen-ui-lib', icon: 'star' },
      ],
    },
    tapeStyle: '',
  },
  {
    week: 'Week of Oct 9th',
    icon: 'event',
    topSummary: {
      title: 'Top Summary',
      description: 'Focus shifted heavily towards soft minimal design patterns in enterprise tools. "Cute-tech" is becoming a legitimate strategy for user retention.',
      tags: [
        { text: '#UIUX', className: 'bg-tertiary-container text-on-tertiary-container' },
        { text: '#Design', className: 'bg-error-container text-on-error-container' },
      ],
    },
    trendingRepos: {
      title: 'Trending Repos',
      items: [
        { name: 'pastel-components', icon: 'star' },
        { name: 'fluid-grid-react', icon: 'star' },
      ],
    },
    tapeStyle: "transform: translateX(-50%) rotate(1deg); width: 60px;",
  },
  {
    week: 'Week of Oct 2nd',
    icon: 'event',
    topSummary: null,
    trendingRepos: null,
    tapeStyle: "transform: translateX(-50%) rotate(-3deg); left: 80%;",
    illegible: true,
  },
]