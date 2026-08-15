import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Index from './pages/Index'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <Index />
      )}
    </div>
  )
}

export default App
