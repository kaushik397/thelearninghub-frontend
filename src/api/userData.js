import { supabase } from '../lib/supabase';

function requireUserId(userId) {
  if (!userId) {
    throw new Error('You must be signed in to save profile data.');
  }
}

export async function upsertProfile({ userId, email, fullName, dateOfBirth, onboardingCompletedAt }) {
  requireUserId(userId);

  const payload = {
    id: userId,
    email,
    full_name: fullName,
    date_of_birth: dateOfBirth || null,
  };

  if (onboardingCompletedAt) {
    payload.onboarding_completed_at = onboardingCompletedAt;
  }

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
}

export async function upsertLearnerProfile({ userId, updates }) {
  requireUserId(userId);

  const { error } = await supabase
    .from('learner_profiles')
    .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' });

  if (error) throw error;
}

export async function getDashboardData(userId) {
  requireUserId(userId);

  const [profileResult, learnerResult, tracksResult, sessionsResult, progressResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('learner_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase
      .from('learning_tracks')
      .select('id,title,description,icon,progress_percent,last_accessed_at,created_at')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('learning_sessions')
      .select('id,status,started_at,ended_at')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(50),
    supabase
      .from('progress_events')
      .select('event_type,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200),
  ]);

  const firstError = [
    profileResult.error,
    learnerResult.error,
    tracksResult.error,
    sessionsResult.error,
    progressResult.error,
  ].find(Boolean);

  if (firstError) throw firstError;

  const tracks = tracksResult.data || [];
  const sessions = sessionsResult.data || [];
  const progressEvents = progressResult.data || [];

  return {
    profile: profileResult.data,
    learnerProfile: learnerResult.data,
    tracks,
    resumeTrack: tracks.find((track) => Number(track.progress_percent) < 100) || tracks[0] || null,
    stats: buildDashboardStats({ tracks, sessions, progressEvents }),
  };
}

export async function createLearningTrack({ userId, title, description, icon = 'auto_stories' }) {
  requireUserId(userId);

  const { data, error } = await supabase
    .from('learning_tracks')
    .insert({
      user_id: userId,
      title,
      description,
      icon,
      progress_percent: 0,
      last_accessed_at: new Date().toISOString(),
    })
    .select('id,title,description,icon,progress_percent,last_accessed_at,created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function createSourceMaterial({
  userId,
  type,
  title,
  originalFilename,
  url,
  mimeType,
  fileSizeBytes,
}) {
  requireUserId(userId);

  const { data, error } = await supabase
    .from('source_materials')
    .insert({
      user_id: userId,
      type,
      title: title || originalFilename || url || 'Study material',
      original_filename: originalFilename || null,
      url: url || null,
      mime_type: mimeType || null,
      file_size_bytes: fileSizeBytes || null,
      processing_status: 'processing',
    })
    .select('id,user_id,type,title,original_filename,url,processing_status,created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function markSourceMaterialReady({ materialId, userId }) {
  requireUserId(userId);
  if (!materialId) return null;

  const { data, error } = await supabase
    .from('source_materials')
    .update({ processing_status: 'ready' })
    .eq('id', materialId)
    .eq('user_id', userId)
    .select('id,processing_status')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function markSourceMaterialFailed({ materialId, userId, errorMessage }) {
  requireUserId(userId);
  if (!materialId) return null;

  const { data, error } = await supabase
    .from('source_materials')
    .update({ processing_status: 'failed', processing_error: errorMessage || 'Processing failed' })
    .eq('id', materialId)
    .eq('user_id', userId)
    .select('id,processing_status')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createLearningSession({ userId, trackId, topic, learnerGoal, plannedDurationMinutes }) {
  requireUserId(userId);

  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({
      user_id: userId,
      track_id: trackId || null,
      topic: topic || 'Learning Session',
      learner_goal: learnerGoal || null,
      planned_duration_minutes: plannedDurationMinutes || null,
      status: 'active',
    })
    .select('id,user_id,track_id,topic,status,started_at,created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function linkSessionMaterial({ sessionId, materialId }) {
  if (!sessionId || !materialId) return null;

  const { data, error } = await supabase
    .from('session_materials')
    .upsert({ session_id: sessionId, material_id: materialId }, { onConflict: 'session_id,material_id' })
    .select('session_id,material_id')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveGeneratedNotes({ sessionId, notesMarkdown, model = 'gemma', promptVersion = 'v1' }) {
  if (!sessionId) {
    throw new Error('A learning session is required to save generated notes.');
  }

  const { data, error } = await supabase
    .from('generated_notes')
    .insert({
      session_id: sessionId,
      notes_markdown: notesMarkdown,
      model,
      prompt_version: promptVersion,
    })
    .select('id,session_id,notes_markdown,model,prompt_version,created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestSavedNotesForTrack({ userId, trackId }) {
  requireUserId(userId);
  if (!trackId) return null;

  const { data: session, error: sessionError } = await supabase
    .from('learning_sessions')
    .select('id,track_id,topic,status,started_at,created_at')
    .eq('user_id', userId)
    .eq('track_id', trackId)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) throw sessionError;
  if (!session) return null;

  const { data: notes, error: notesError } = await supabase
    .from('generated_notes')
    .select('id,session_id,notes_markdown,model,prompt_version,created_at')
    .eq('session_id', session.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (notesError) throw notesError;
  if (!notes) return null;

  const { data: sessionMaterial, error: sessionMaterialError } = await supabase
    .from('session_materials')
    .select('material_id')
    .eq('session_id', session.id)
    .limit(1)
    .maybeSingle();

  if (sessionMaterialError) throw sessionMaterialError;

  return { session, notes, materialId: sessionMaterial?.material_id || null };
}

export async function updateLearningTrackProgress({ userId, trackId, progressPercent }) {
  requireUserId(userId);
  if (!trackId) return null;

  const { data, error } = await supabase
    .from('learning_tracks')
    .update({
      progress_percent: Math.max(0, Math.min(100, progressPercent)),
      last_accessed_at: new Date().toISOString(),
    })
    .eq('id', trackId)
    .eq('user_id', userId)
    .select('id,title,description,icon,progress_percent,last_accessed_at,created_at')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function logProgressEvent({ userId, eventType, eventData = {} }) {
  requireUserId(userId);

  const { error } = await supabase.from('progress_events').insert({
    user_id: userId,
    event_type: eventType,
    event_data: eventData,
  });

  if (error) throw error;
}

function buildDashboardStats({ tracks, sessions, progressEvents }) {
  const completedTracks = tracks.filter((track) => Number(track.progress_percent) >= 100).length;
  const completedSessions = sessions.filter((session) => session.status === 'completed').length;
  const activeDays = new Set(
    progressEvents.map((event) => new Date(event.created_at).toISOString().slice(0, 10)),
  ).size;

  return [
    { val: activeDays, label: 'Active Days' },
    { val: completedSessions, label: 'Sessions Done' },
    { val: completedTracks, label: 'Completed Tracks' },
  ];
}
