import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { supabase } from '../lib/supabase';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,full_name,date_of_birth,onboarding_completed_at')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('Failed to load profile:', error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
      if (data.session?.user?.id) {
        await fetchProfile(data.session.user.id);
      } else {
        setProfile(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession?.user?.id) {
        fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  }, [fetchProfile, session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      profileLoading,
      refreshProfile,
      loading,
      signIn: ({ email, password }) => supabase.auth.signInWithPassword({ email, password }),
      signUp: ({ email, password, fullName, dateOfBirth }) =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              date_of_birth: dateOfBirth,
            },
          },
        }),
      signOut: () => supabase.auth.signOut(),
    }),
    [loading, profile, profileLoading, refreshProfile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
