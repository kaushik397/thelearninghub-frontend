import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';

export default function ProtectedRoute({ children }) {
  const { user, loading, profile, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <span className="section-label">Loading</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const onOnboardingRoute = location.pathname.startsWith('/onboarding');
  const onboardingComplete = Boolean(profile?.onboarding_completed_at);

  if (!onboardingComplete && !onOnboardingRoute) {
    return <Navigate to="/onboarding/2" replace />;
  }

  return children;
}
