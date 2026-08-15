import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import WorksSection from '../components/WorksSection'
import JournalSection from '../components/JournalSection'
import ExplorationsSection from '../components/ExplorationsSection'
import TimelineSection from '../components/TimelineSection'
import StatsSection from '../components/StatsSection'
import ContactSection from '../components/ContactSection'

export default function Index() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 w-full overflow-x-hidden">
        <HeroSection />
        <WorksSection />
        <JournalSection />
        <ExplorationsSection />
        <TimelineSection />
        <StatsSection />
        <ContactSection />
      </main>
    </>
  )
}
