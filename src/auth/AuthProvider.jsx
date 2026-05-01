import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { supabase } from '../lib/supabase';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
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
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
