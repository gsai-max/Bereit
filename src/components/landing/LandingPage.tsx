import { LandingHero } from './LandingHero'
import { ScopeNotice } from './ScopeNotice'

export interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="space-y-8 sm:space-y-10 py-2 sm:py-6 animate-in fade-in duration-300">
      <LandingHero onStart={onStart} />
      <ScopeNotice />
    </div>
  )
}

