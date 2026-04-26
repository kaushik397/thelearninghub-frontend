import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import OnboardingStep1 from './pages/OnboardingStep1'
import OnboardingStep2 from './pages/OnboardingStep2'
import OnboardingStep3 from './pages/OnboardingStep3'
import OnboardingStep4 from './pages/OnboardingStep4'
import Dashboard from './pages/Dashboard'
import StartSession from './pages/StartSession'
import ModuleView from './pages/ModuleView'
import ConceptView from './pages/ConceptView'
import AudioSession from './pages/AudioSession'
import AssessmentSession from './pages/AssessmentSession'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Onboarding */}
        <Route path="/onboarding/1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/3" element={<OnboardingStep3 />} />
        <Route path="/onboarding/4" element={<OnboardingStep4 />} />
        
        {/* App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/start-session" element={<StartSession />} />
        
        {/* Learning */}
        <Route path="/module" element={<ModuleView />} />
        <Route path="/concept" element={<ConceptView />} />
        <Route path="/audio" element={<AudioSession />} />
        <Route path="/assessment" element={<AssessmentSession />} />
      </Routes>
    </div>
  )
}

export default App
