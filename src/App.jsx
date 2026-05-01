import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
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
        <Route path="/login" element={<Login />} />

        {/* Onboarding */}
        <Route path="/onboarding/1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/2" element={<ProtectedRoute><OnboardingStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/3" element={<ProtectedRoute><OnboardingStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/4" element={<ProtectedRoute><OnboardingStep4 /></ProtectedRoute>} />
        
        {/* App */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/start-session" element={<ProtectedRoute><StartSession /></ProtectedRoute>} />
        
        {/* Learning */}
        <Route path="/module" element={<ProtectedRoute><ModuleView /></ProtectedRoute>} />
        <Route path="/concept" element={<ProtectedRoute><ConceptView /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioSession /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentSession /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
