import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import WorksSection from '../components/WorksSection'
import JournalSection from '../components/JournalSection'
import ExplorationsSection from '../components/ExplorationsSection'
import TimelineSection from '../components/TimelineSection'
import SkillsSection from '../components/SkillsSection'
import StatsSection from '../components/StatsSection'
import ContactSection from '../components/ContactSection'
import SEO from '../components/SEO'

export default function Index() {
  return (
    <>
      <SEO />
      <Navbar />
      <main className="relative z-10 w-full overflow-x-hidden">
        <HeroSection />
        <WorksSection />
        <JournalSection />
        <ExplorationsSection />
        <TimelineSection />
        <SkillsSection />
        <StatsSection />
        <ContactSection />
      </main>
    </>
  )
}
